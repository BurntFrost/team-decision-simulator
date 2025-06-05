import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

export function runCLI(argv) {
  const program = new Command();
  program
    .name('task-master')
    .description('Simple task management CLI');

  program
    .command('list')
    .description('List tasks from tasks.json')
    .option('-f, --file <file>', 'Tasks file', 'tasks.json')
    .action((opts) => {
      const filePath = path.resolve(opts.file);
      if (!fs.existsSync(filePath)) {
        console.error(`Tasks file not found: ${filePath}`);
        return;
      }
      try {
        const tasks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        for (const t of tasks) {
          console.log(`${t.id}: ${t.title} [${t.status}]`);
        }
      } catch (err) {
        console.error('Failed to read tasks:', err);
      }
    });

  program.parse(argv);
}
