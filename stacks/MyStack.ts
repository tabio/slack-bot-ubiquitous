import * as cdk from "aws-cdk-lib";
import * as sst from "@serverless-stack/resources";

const CIDR = "192.168.9.0/24";
const DB_NAME = "slack_bot_db";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // SSM (for slack secrets)
    const slackSigningSecret = cdk.aws_ssm.StringParameter.valueFromLookup(
      this,
      "slack-bot-signing-secret"
    );
    const slackBotToken = cdk.aws_ssm.StringParameter.valueFromLookup(
      this,
      "slack-bot-token"
    );

    // VPC
    const vpc = new cdk.aws_ec2.Vpc(this, `vpc-${scope.name}`, {
      cidr: CIDR,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: `private-subnet-${scope.name}`,
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 25,
        },
      ],
    });
    const securityGroup = new cdk.aws_ec2.SecurityGroup(
      this,
      `securityGroups-${scope.name}`,
      {
        securityGroupName: `security-group-${scope.name}`,
        vpc: vpc,
      }
    );
    securityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(CIDR),
      cdk.aws_ec2.Port.tcp(3306)
    );

    // Aurora Serverless
    const parameterGroup = new cdk.aws_rds.ParameterGroup(
      this,
      `aurora-serverless-pg-${scope.name}`,
      {
        engine: cdk.aws_rds.DatabaseClusterEngine.AURORA_MYSQL,
        parameters: {
          time_zone: "Asia/Tokyo",
          character_set_client: "utf8mb4",
          character_set_connection: "utf8mb4",
          character_set_database: "utf8mb4",
          character_set_filesystem: "utf8mb4",
          character_set_results: "utf8mb4",
          character_set_server: "utf8mb4",
          collation_connection: "utf8mb4_bin",
        },
      }
    );
    const rdsCredentials = cdk.aws_rds.Credentials.fromGeneratedSecret(
      DB_NAME,
      { secretName: `secrets-manager-${scope.name}` }
    );
    const subnet = { subnetGroupName: `private-subnet-${scope.name}` };
    const serverlessCluster = new cdk.aws_rds.ServerlessCluster(
      this,
      `serverless-cluster-${scope.name}`,
      {
        clusterIdentifier: `aurora-serverless-mysql-${scope.name}`,
        credentials: rdsCredentials,
        defaultDatabaseName: DB_NAME,
        engine: cdk.aws_rds.DatabaseClusterEngine.AURORA_MYSQL,
        enableDataApi: true,
        parameterGroup: parameterGroup,
        securityGroups: [securityGroup],
        scaling: {
          autoPause: cdk.Duration.minutes(10),
        },
        vpc: vpc,
        vpcSubnets: subnet,
      }
    );

    // Lambdaに付与するRoleとPolicy
    const lambdaPolicyStatementVpc = new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: ["*"],
      actions: [
        "ec2:CreateNetworkInterface",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
      ],
    });

    const lambdaPolicyStatementLambda = new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: [`arn:aws:lambda:${scope.region}:${this.account}:function:*`],
      actions: ["lambda:InvokeFunction"],
    });

    const lambdaPolicyStatementLogs = new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: [`arn:aws:logs:${scope.region}:${this.account}:*`],
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
    });

    const lambdaPolicyStatementToAuroraServerless =
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        resources: ["*"],
        actions: [
          "secretsmanager:GetSecretValue",
          "rds-data:BatchExecuteStatement",
          "rds-data:BeginTransaction",
          "rds-data:CommitTransaction",
          "rds-data:ExecuteStatement",
          "rds-data:RollbackTransaction",
        ],
      });

    const lambdaPolicyStatementSsm = new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: [`arn:aws:ssm:${scope.region}:${this.account}:*`],
      actions: ["ssm:GetParameters", "ssm:GetParameter"],
    });

    const lambdaPolicyDocument = new cdk.aws_iam.PolicyDocument({
      statements: [
        lambdaPolicyStatementLambda,
        lambdaPolicyStatementLogs,
        lambdaPolicyStatementSsm,
        lambdaPolicyStatementToAuroraServerless,
        lambdaPolicyStatementVpc,
      ],
    });

    const lambdaRole = new cdk.aws_iam.Role(this, `lambdaRole`, {
      roleName: `iamrole-lambda-${scope.name}`,
      assumedBy: new cdk.aws_iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        [`iampolicy-lambda-${scope.name}`]: lambdaPolicyDocument,
      },
    });

    new sst.Api(this, "Api", {
      defaultFunctionProps: {
        architecture: cdk.aws_lambda.Architecture.ARM_64,
        environment: {
          SLACK_SIGNING_SECRET: slackSigningSecret,
          SLACK_BOT_TOKEN: slackBotToken,
          CLUSTER_ARN: serverlessCluster.clusterArn,
          SECRET_ARN: serverlessCluster.secret!.secretArn,
        },
        memorySize: 512,
        runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(10),
        tracing: cdk.aws_lambda.Tracing.ACTIVE,
        reservedConcurrentExecutions: 5, // lambdaの同時実行数の最大値
        role: lambdaRole,
      },
      routes: {
        "POST /slack/events": {
          function: {
            handler: "./src/main.handler",
            functionName: `lambdafunc-${scope.name}`,
          },
        },
      },
    });

    // const lambda = apiGateway.getFunction('$default');
    // serverlessCluster.grantDataApiAccess(lambda);
  }
}
