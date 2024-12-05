const neo4j = require('neo4j-driver');

(async () => {
    let session
    try {
        const driver = neo4j.driver(
            'neo4j://localhost:7687',
            neo4j.auth.basic('neo4j', 'tcgBotApi')
        );
        await driver.executeQuery(`CREATE CONSTRAINT game_id IF NOT EXISTS FOR (n:GAMES) REQUIRE n.id IS UNIQUE`)
        await driver.executeQuery(`CREATE CONSTRAINT game_name IF NOT EXISTS FOR (n:GAMES) REQUIRE n.name IS UNIQUE`)
        session = driver.session();
        const result = await session.executeWrite(async (tx) => {


            await tx.run(`LOAD CSV WITH HEADERS FROM 'file:///games.csv' AS row
            CREATE (o:GAMES {id:row.id,name:row.name,history:row.history})`);

            await tx.run(`LOAD CSV WITH HEADERS FROM 'file:///members.csv' AS row
            MATCH (o:GAMES {name:row.game})
            MERGE (n:MEMBERS {id:row.id,discordId:row.discordId,username:row.username,email:row.email, history:'[]'})-[r:PLAYS {matches:row.matches,wtl:row.wtl,points:row.points}]->(o)`);
        })

        process.exit(0);
    } catch (err) {
        console.error('err', err);
        process.exit(4);
    } finally {
        session.close();
        driver.close();
        process.exit();
    }
})();