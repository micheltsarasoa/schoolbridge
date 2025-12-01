import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to find the project root by looking for package.json
function findProjectRoot(startDir) {
    let currentDir = startDir;
    while (true) {
        try {
            readFileSync(resolve(currentDir, 'package.json'));
            return currentDir;
        } catch (e) {
            const parentDir = dirname(currentDir);
            if (parentDir === currentDir) {
                throw new Error('Could not find project root containing package.json');
            }
            currentDir = parentDir;
        }
    }
}

// Function to parse a .env file
function parseEnv(filePath) {
    const env = {};
    try {
        const content = readFileSync(filePath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove surrounding quotes
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }
                env[key] = value;
            }
        });
    } catch (e) {
        console.error(`Error reading or parsing env file at ${filePath}: ${e.message}`);
        process.exit(1);
    }
    return env;
}

async function querySupabase(table) {
    if (!table) {
        console.error('Error: Table name is required.');
        console.log('Usage: supabase_query <table>');
        return;
    }

    const projectRoot = findProjectRoot(resolve(__dirname, '..', '..'));
    const envPath = resolve(projectRoot, '.env.local');
    const envConfig = parseEnv(envPath);

    const supabaseUrl = envConfig.SUPABASE_URL;
    const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
        process.exit(1);
    }

    const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!projectRefMatch) {
        console.error('Error: Could not extract project reference from SUPABASE_URL');
        process.exit(1);
    }
    const projectRef = projectRefMatch[1];
    const apiUrl = `https://${projectRef}.supabase.co/rest/v1/${table}?select=*`;

    const options = {
        method: 'GET',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolvePromise, rejectPromise) => {
        const req = https.request(apiUrl, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolvePromise(JSON.parse(data));
                    } catch (e) {
                        rejectPromise(new Error('Failed to parse JSON response.'));
                    }
                } else {
                     rejectPromise(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            rejectPromise(new Error(`Request error: ${e.message}`));
        });

        req.end();
    });
}

// Main execution
if (process.argv.length < 3) {
    console.error('Error: Table name argument is missing.');
    console.log('Usage: node supabase_query.mjs <tableName>');
    process.exit(1);
}

const tableArg = process.argv[2];

try {
    const data = await querySupabase(tableArg);
    console.log(JSON.stringify(data, null, 2));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
