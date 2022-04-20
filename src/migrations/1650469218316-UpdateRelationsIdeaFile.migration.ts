import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRelationsIdeaFile1650469218316 implements MigrationInterface {
    name = 'UpdateRelationsIdeaFile1650469218316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD \`image_id\` int NULL AFTER category_id`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD UNIQUE INDEX \`IDX_c180c80cd580c8a3507d0f55f0\` (\`image_id\`)`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD \`document_id\` int NULL  AFTER image_id`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD UNIQUE INDEX \`IDX_bf5843c2ea1f7b9958e314389d\` (\`document_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c180c80cd580c8a3507d0f55f0\` ON \`ideas\` (\`image_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_bf5843c2ea1f7b9958e314389d\` ON \`ideas\` (\`document_id\`)`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD CONSTRAINT \`FK_c180c80cd580c8a3507d0f55f03\` FOREIGN KEY (\`image_id\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD CONSTRAINT \`FK_bf5843c2ea1f7b9958e314389d4\` FOREIGN KEY (\`document_id\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP FOREIGN KEY \`FK_bf5843c2ea1f7b9958e314389d4\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP FOREIGN KEY \`FK_c180c80cd580c8a3507d0f55f03\``);
        await queryRunner.query(`DROP INDEX \`REL_bf5843c2ea1f7b9958e314389d\` ON \`ideas\``);
        await queryRunner.query(`DROP INDEX \`REL_c180c80cd580c8a3507d0f55f0\` ON \`ideas\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP INDEX \`IDX_bf5843c2ea1f7b9958e314389d\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP COLUMN \`document_id\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP INDEX \`IDX_c180c80cd580c8a3507d0f55f0\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP COLUMN \`image_id\``);
    }

}
