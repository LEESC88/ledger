import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export interface TenantScopedEntity extends ObjectLiteral {
  id: string | number;
  userId: string;
}

/**
 * Deep multi-tenant repository seam.
 * Guarantees every query, insert, and delete is strictly scoped to a single `userId`.
 */
export class TenantRepository<T extends TenantScopedEntity> {
  constructor(private readonly repo: Repository<T>) {}

  private assertTenant(userId: string): string {
    const normalized = typeof userId === 'string' ? userId.trim() : '';
    if (!normalized) {
      throw new Error('TenantRepository requires a non-empty userId');
    }
    return normalized;
  }

  async findAll(
    userId: string,
    options: Omit<FindManyOptions<T>, 'where'> & {
      where?: FindOptionsWhere<T>;
    } = {},
  ): Promise<T[]> {
    const tenantId = this.assertTenant(userId);
    return this.repo.find({
      ...options,
      where: {
        ...options.where,
        userId: tenantId,
      } as FindOptionsWhere<T>,
    });
  }

  async findOneById(userId: string, id: T['id']): Promise<T | null> {
    const tenantId = this.assertTenant(userId);
    return this.repo.findOne({
      where: { id, userId: tenantId } as FindOptionsWhere<T>,
    });
  }

  async createAndSave(
    userId: string,
    data: Omit<DeepPartial<T>, 'userId'>,
  ): Promise<T> {
    const tenantId = this.assertTenant(userId);
    const entity = this.repo.create({
      ...data,
      userId: tenantId,
    } as DeepPartial<T>);
    return this.repo.save(entity);
  }

  async deleteById(userId: string, id: T['id']): Promise<boolean> {
    const tenantId = this.assertTenant(userId);
    const result = await this.repo.delete({
      id,
      userId: tenantId,
    } as FindOptionsWhere<T>);
    return (result.affected ?? 0) > 0;
  }
}
