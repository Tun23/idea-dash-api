import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1650463395520 implements MigrationInterface {
    name = 'InitDatabase1650463395520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`creator_id\` int NOT NULL, \`idea_id\` int NOT NULL, \`comment\` text NULL, \`created_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_flag\` tinyint(1) NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_8bf68bc960f2b69e818bdb90dc\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`files\` (\`id\` int NOT NULL AUTO_INCREMENT, \`creator_id\` int NOT NULL, \`idea_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`source_url\` text NOT NULL, \`created_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_flag\` tinyint(1) NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_6c16b9093a142e0e7613b04a3d\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ideas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`creator_id\` int NOT NULL, \`category_id\` int NOT NULL, \`title\` text NULL, \`description\` text NULL, \`is_incognito\` tinyint(1) NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_flag\` tinyint(1) NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_6ab43f1e9b1cef0d8f3e56ce3a\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`creator_id\` int NOT NULL, \`name\` text NULL, \`description\` text NULL, \`lock_date\` timestamp NULL, \`close_date\` timestamp NULL, \`created_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_flag\` tinyint(1) NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_24dbc6126a28ff948da33e97d3\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NULL, \`user_name\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`department_id\` int NULL, \`role\` tinyint NULL DEFAULT '3', \`created_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_flag\` tinyint(1) NOT NULL DEFAULT '0', INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`departments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NULL, \`created_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_flag\` tinyint(1) NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_839517a681a86bb84cbcc6a1e9\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`upvotes\` (\`idea_id\` int NOT NULL, \`user_id\` int NOT NULL, INDEX \`IDX_4386f044e5af07aa735bb2361e\` (\`idea_id\`), INDEX \`IDX_8bf420c798307dc18c61910092\` (\`user_id\`), PRIMARY KEY (\`idea_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`downvotes\` (\`idea_id\` int NOT NULL, \`user_id\` int NOT NULL, INDEX \`IDX_32e3b98e4f064f0b1534dafd57\` (\`idea_id\`), INDEX \`IDX_6686a260835faa18a68aafe933\` (\`user_id\`), PRIMARY KEY (\`idea_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_ae79ee0b70da15c00c55a06c28e\` FOREIGN KEY (\`idea_id\`) REFERENCES \`ideas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7761ee03973c7c9375b032ca676\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_e7660da14a4b0e9bdb9a028ca5e\` FOREIGN KEY (\`idea_id\`) REFERENCES \`ideas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_a8b5cf9abdae34c2dfd58823dce\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD CONSTRAINT \`FK_a79a38cb2aaef0313e1d09c02d5\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ideas\` ADD CONSTRAINT \`FK_b5466e8e06b5e28e3bc5e344c3d\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_75fbfb148e4683b47bb64bbeed9\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_0921d1972cf861d568f5271cd85\` FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`upvotes\` ADD CONSTRAINT \`FK_4386f044e5af07aa735bb2361e2\` FOREIGN KEY (\`idea_id\`) REFERENCES \`ideas\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`upvotes\` ADD CONSTRAINT \`FK_8bf420c798307dc18c619100923\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`downvotes\` ADD CONSTRAINT \`FK_32e3b98e4f064f0b1534dafd57d\` FOREIGN KEY (\`idea_id\`) REFERENCES \`ideas\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`downvotes\` ADD CONSTRAINT \`FK_6686a260835faa18a68aafe9334\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`downvotes\` DROP FOREIGN KEY \`FK_6686a260835faa18a68aafe9334\``);
        await queryRunner.query(`ALTER TABLE \`downvotes\` DROP FOREIGN KEY \`FK_32e3b98e4f064f0b1534dafd57d\``);
        await queryRunner.query(`ALTER TABLE \`upvotes\` DROP FOREIGN KEY \`FK_8bf420c798307dc18c619100923\``);
        await queryRunner.query(`ALTER TABLE \`upvotes\` DROP FOREIGN KEY \`FK_4386f044e5af07aa735bb2361e2\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_0921d1972cf861d568f5271cd85\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_75fbfb148e4683b47bb64bbeed9\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP FOREIGN KEY \`FK_b5466e8e06b5e28e3bc5e344c3d\``);
        await queryRunner.query(`ALTER TABLE \`ideas\` DROP FOREIGN KEY \`FK_a79a38cb2aaef0313e1d09c02d5\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_a8b5cf9abdae34c2dfd58823dce\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_e7660da14a4b0e9bdb9a028ca5e\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7761ee03973c7c9375b032ca676\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_ae79ee0b70da15c00c55a06c28e\``);
        await queryRunner.query(`DROP INDEX \`IDX_6686a260835faa18a68aafe933\` ON \`downvotes\``);
        await queryRunner.query(`DROP INDEX \`IDX_32e3b98e4f064f0b1534dafd57\` ON \`downvotes\``);
        await queryRunner.query(`DROP TABLE \`downvotes\``);
        await queryRunner.query(`DROP INDEX \`IDX_8bf420c798307dc18c61910092\` ON \`upvotes\``);
        await queryRunner.query(`DROP INDEX \`IDX_4386f044e5af07aa735bb2361e\` ON \`upvotes\``);
        await queryRunner.query(`DROP TABLE \`upvotes\``);
        await queryRunner.query(`DROP INDEX \`IDX_839517a681a86bb84cbcc6a1e9\` ON \`departments\``);
        await queryRunner.query(`DROP TABLE \`departments\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_24dbc6126a28ff948da33e97d3\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ab43f1e9b1cef0d8f3e56ce3a\` ON \`ideas\``);
        await queryRunner.query(`DROP TABLE \`ideas\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c16b9093a142e0e7613b04a3d\` ON \`files\``);
        await queryRunner.query(`DROP TABLE \`files\``);
        await queryRunner.query(`DROP INDEX \`IDX_8bf68bc960f2b69e818bdb90dc\` ON \`comments\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}
