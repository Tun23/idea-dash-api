import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommentIncognito1650959550248 implements MigrationInterface {
  name = 'AddCommentIncognito1650959550248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`comments\` ADD \`is_incognito\` tinyint(1) NOT NULL DEFAULT '0'  AFTER comment`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`is_incognito\``);
  }
}
