import pm2, { Proc, ProcessDescription, StartOptions } from 'pm2';
import { promisify } from 'util';

class Pm2Lib {
  private readonly SCRIPT_PATH = process.env.SCRIPT_PATH;
  private readonly MINERS = ['miner01.js', 'miner02.js'];

  async getProcesses(): Promise<ProcessDescription[]> {
    const processes: ProcessDescription[] = [];

    for (const miner of this.MINERS) {
      const [proc] = await promisify(pm2.describe).call(pm2, miner);
      if (proc) {
        processes.push(proc);
      } else {
        processes.push({
          name: miner,
          pm2_env: {
            status: 'stopped',
          },
        });
      }
    }

    return processes;
  }

  async startProcess(filename: string): Promise<Proc> {
    const proc = this.getStartOptions(filename);

    return promisify<StartOptions, Proc>(pm2.start).call(pm2, proc);
  }

  async restartProcess(filename: string): Promise<Proc> {
    return promisify(pm2.restart).call(pm2, filename);
  }

  async stopProcess(filename: string): Promise<Proc> {
    return promisify(pm2.stop).call(pm2, filename);
  }

  private getStartOptions(filename: string): StartOptions {
    const alias = filename.replace('.js', '');
    return {
      script: `${this.SCRIPT_PATH}/${filename}`,
      name: filename,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      output: `${this.SCRIPT_PATH}/${alias}.stdout.log`,
      error: `${this.SCRIPT_PATH}/${alias}.stderr.log`,
      exec_mode: 'fork',
    };
  }
}

export default new Pm2Lib();
