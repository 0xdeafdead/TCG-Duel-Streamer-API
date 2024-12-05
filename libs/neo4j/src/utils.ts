import neo4j, { Driver } from 'neo4j-driver';

export type Neo4jScheme =
    | 'neo4j'
    | 'neo4j+s'
    | 'neo4j+scc'
    | 'bolt'
    | 'bolt+s'
    | 'bolt+scc';

export interface Neo4jConfig {
    scheme: Neo4jScheme;
    host: string;
    port: number | string;
    username: string;
    password: string;
    // database?: string;
    // modelDirectory: string;
    global?: boolean;
}

export const createConnection = async (config: Neo4jConfig) => {
    const { scheme, host, port, username, password } = config;
    let neoDriver: Driver
    try {
        neoDriver = neo4j.driver(
            `${scheme}://${host}:${port}`,
            neo4j.auth.basic(
                username,
                password)
        );
        await neoDriver.getServerInfo()
        return neoDriver;
    } catch (err) {
        const errors = Array.isArray(err.errors)
            ? err.errors.map((error) => error.error)
            : err;
        console.error('[NeoError]:', errors);
        neoDriver.close()
    }
};
