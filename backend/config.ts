interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

interface Config {
    port: number;
    database: DatabaseConfig;
    apiKey: string;
    jwtSecret: string;
}

