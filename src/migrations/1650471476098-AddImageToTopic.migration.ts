import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImageToTopic1650471476098 implements MigrationInterface {
    name = 'AddImageToTopic1650471476098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b1aae736b7c5d6925efa856352\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`image_id\` int NULL  AFTER creator_id`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD UNIQUE INDEX \`IDX_5336de31c6bef5b1e543d66d2b\` (\`image_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_5336de31c6bef5b1e543d66d2b\` ON \`categories\` (\`image_id\`)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_5336de31c6bef5b1e543d66d2bc\` FOREIGN KEY (\`image_id\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_5336de31c6bef5b1e543d66d2bc\``);
        await queryRunner.query(`DROP INDEX \`REL_5336de31c6bef5b1e543d66d2b\` ON \`categories\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP INDEX \`IDX_5336de31c6bef5b1e543d66d2b\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`image_id\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b1aae736b7c5d6925efa856352\` ON \`users\` (\`image_id\`)`);
    }

}
