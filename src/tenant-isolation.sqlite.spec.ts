import { Column, DataSource, Entity, PrimaryColumn } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { TenantRepository } from './common/tenant/tenant-repository.js';

@Entity('tenant_test_projects')
class TenantTestProject {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 64 })
  userId!: string;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'float', default: 0 })
  targetAmount!: number;
}

describe('TenantRepository (In-Memory SQLite Integration)', () => {
  let dataSource: DataSource;
  let projectRepo: TenantRepository<TenantTestProject>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [TenantTestProject],
      synchronize: true,
    });
    await dataSource.initialize();
    projectRepo = new TenantRepository(
      dataSource.getRepository(TenantTestProject),
    );
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('isolates reads, lookups, and deletes across tenants on real SQLite', async () => {
    await projectRepo.createAndSave('tenant-A', {
      id: 'proj-a1',
      title: 'Tenant A Travel Fund',
      targetAmount: 2000,
    });

    await projectRepo.createAndSave('tenant-B', {
      id: 'proj-b1',
      title: 'Tenant B Car Fund',
      targetAmount: 5000,
    });

    // Tenant A only sees its own project
    const listA = await projectRepo.findAll('tenant-A');
    expect(listA.map((p) => p.id)).toEqual(['proj-a1']);

    // Tenant B cannot read or delete Tenant A's project
    expect(await projectRepo.findOneById('tenant-B', 'proj-a1')).toBeNull();
    expect(await projectRepo.deleteById('tenant-B', 'proj-a1')).toBe(false);

    // Tenant A can read and delete its own project
    expect((await projectRepo.findOneById('tenant-A', 'proj-a1'))?.title).toBe(
      'Tenant A Travel Fund',
    );
    expect(await projectRepo.deleteById('tenant-A', 'proj-a1')).toBe(true);
    expect(await projectRepo.findAll('tenant-A')).toEqual([]);
  });

  it('rejects empty tenantId', async () => {
    await expect(projectRepo.findAll('   ')).rejects.toThrow(
      'TenantRepository requires a non-empty userId',
    );
  });
});
