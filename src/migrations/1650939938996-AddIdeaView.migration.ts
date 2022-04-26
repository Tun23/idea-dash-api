import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIdeaView1650939938996 implements MigrationInterface {
    name = 'AddIdeaView1650939938996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD \`total_view\` int NOT NULL DEFAULT '0' AFTER is_incognito`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP COLUMN \`total_view\``);
    }

}
