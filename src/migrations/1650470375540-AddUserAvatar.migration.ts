import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserAvatar1650470375540 implements MigrationInterface {
    name = 'AddUserAvatar1650470375540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_bf5843c2ea1f7b9958e314389d\` ON \`ideas\``);
        await queryRunner.query(`DROP INDEX \`IDX_c180c80cd580c8a3507d0f55f0\` ON \`ideas\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`image_id\` int NULL  AFTER department_id`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_b1aae736b7c5d6925efa856352\` (\`image_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_b1aae736b7c5d6925efa856352\` ON \`users\` (\`image_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b1aae736b7c5d6925efa8563527\` FOREIGN KEY (\`image_id\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1aae736b7c5d6925efa8563527\``);
        await queryRunner.query(`DROP INDEX \`REL_b1aae736b7c5d6925efa856352\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_b1aae736b7c5d6925efa856352\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`image_id\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c180c80cd580c8a3507d0f55f0\` ON \`ideas\` (\`image_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_bf5843c2ea1f7b9958e314389d\` ON \`ideas\` (\`document_id\`)`);
    }

}
