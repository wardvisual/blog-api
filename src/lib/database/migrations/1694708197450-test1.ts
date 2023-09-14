import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test11694708197450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`UPDATE users SET firstName = edward`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`UPDATE users SET firstName = woww`);
  }
}
