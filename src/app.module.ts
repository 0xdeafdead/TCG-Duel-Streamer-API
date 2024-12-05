import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchModule } from './match/match.module';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule } from '@app/neo4j';


@Module({
  imports: [ConfigModule.forRoot(), MatchModule, Neo4jModule.forRoot({
    global: true,
    scheme: process.env.APP_ENV === "development" ? "neo4j" : "neo4j+s",
    host: process.env.NEO_HOST,
    password: process.env.NEO_PASSWRD,
    port: process.env.NEO_PORT,
    username: process.env.NEO_USERNAME
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
