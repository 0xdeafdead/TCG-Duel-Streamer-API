import { DynamicModule, Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { createConnection, Neo4jConfig } from './utils';
import { CONFIG_OPTIONS, CONNECTION } from './constants';

@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      global: !!config.global,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: config,
        },
        {
          provide: CONNECTION,
          inject: [CONFIG_OPTIONS],
          useFactory: async (config: Neo4jConfig) => {
            return await createConnection(config);
          },
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}
