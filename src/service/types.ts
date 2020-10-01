import { RequestHandler } from 'express';

export interface IBaseMapper<DTO, Model> {
  toEntity(dto: DTO): Model;
  toDto(entity: Model): DTO;
}

export type SortOrder = 'ASC' | 'DESC';

export type Sort = [string, SortOrder];

interface ParamsDictionary {
  [key: string]: string;
}
type ParamsArray = string[];
type QueryParams = ParamsDictionary | ParamsArray;

export type ApiMiddleware<
  Body = UnknownRecord,
  Query = qs.ParsedQs,
  Params extends QueryParams = ParamsDictionary
> = RequestHandler<Params, any, Body, Query>;
