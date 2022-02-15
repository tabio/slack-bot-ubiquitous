import { getRepository } from "typeorm";
import { Ubiquitous } from "../entities/ubiquitous";

const MAX_KEYWORD_LENTGH = 20;
const MAX_DETAIL_LENTGH = 140;

// Aurora Serverless 起動用に利用
export const countUbiquitous = async (): Promise<any> => {
  const ubiquitousRepository = getRepository(Ubiquitous);
  return await ubiquitousRepository.count();
};

// 更新
export const updateUbiquitous = async (
  keyword?: string,
  detail?: string
): Promise<any> => {
  const ubiquitousRepository = getRepository(Ubiquitous);

  // validation
  if (!keyword) {
    throw `キーワードは必須です`;
  }

  if (!detail) {
    throw `詳細は必須です`;
  }
  if (detail.length > MAX_DETAIL_LENTGH) {
    throw `詳細は${MAX_DETAIL_LENTGH}文字以内で登録してください`;
  }

  const ubiquitous = await ubiquitousRepository.findOne({ keyword: keyword });

  if (!ubiquitous) {
    throw `${keyword}が存在しません`;
  }

  ubiquitous.detail = detail;

  return await ubiquitousRepository.save(ubiquitous);
};

// 登録
export const saveUbiquitous = async (
  keyword?: string,
  detail?: string
): Promise<any> => {
  const ubiquitousRepository = getRepository(Ubiquitous);

  // validation
  if (!keyword) {
    throw `キーワードは必須です`;
  }
  if (keyword.length > MAX_KEYWORD_LENTGH) {
    throw `キーワードは${MAX_KEYWORD_LENTGH}文字以内で登録してください`;
  }
  if (!detail) {
    throw `詳細は必須です`;
  }
  if (detail.length > MAX_DETAIL_LENTGH) {
    throw `詳細は${MAX_DETAIL_LENTGH}文字以内で登録してください`;
  }

  // 既に登録済みかどうかをチェック
  const result = await ubiquitousRepository.findOne({ keyword: keyword });
  if (result) {
    throw `${keyword}は既に登録済みです`;
  }

  const params = ubiquitousRepository.create({
    keyword: keyword,
    detail: detail,
  });
  return await ubiquitousRepository.save(params);
};

// 完全一致
export const findOneUbiquitous = async (keyword: string): Promise<any> => {
  const ubiquitousRepository = getRepository(Ubiquitous);
  return await ubiquitousRepository.findOne({ keyword: keyword });
};

// 部分一致で候補を探す
export const findLikeUbiquitous = async (keyword: string): Promise<any> => {
  const ubiquitousRepository = getRepository(Ubiquitous);
  return await ubiquitousRepository
    .createQueryBuilder()
    .select()
    .where(`MATCH(keyword) AGAINST (:keyword IN BOOLEAN MODE)`, {
      keyword: keyword,
    })
    .getMany();
};

// 削除
export const deleteUbiquitous = async (id: string): Promise<any> => {
  const ubiquitousRepository = getRepository(Ubiquitous);
  return await ubiquitousRepository.delete({ id: Number(id) });
};
