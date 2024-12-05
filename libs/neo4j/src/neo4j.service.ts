import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { CONNECTION } from './constants';
import { Driver } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleDestroy {
    constructor(@Inject(CONNECTION) public readonly instance: Driver) { }

    onModuleDestroy() {
        this.instance.close();
    }

}
