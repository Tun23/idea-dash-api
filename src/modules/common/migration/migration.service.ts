/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {  Connection, getConnection,  } from 'typeorm';

@Injectable()
export class MigrationService {
  constructor() {}

  async migrateUp() {
    try {
      const conn: Connection = getConnection();
      if (conn) {
        await conn.runMigrations();
        console.log(` migrateUp successfully`);
      } else {
        throw new HttpException('Invalid connection to ' + conn.name, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async migrateDown() {
    try {
      const conn: Connection = getConnection();
      if (conn) {
        await conn.undoLastMigration();
        console.log(` migrateDown successfully`);
      } else {
        throw new HttpException('Invalid connection to ' + conn.name, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
