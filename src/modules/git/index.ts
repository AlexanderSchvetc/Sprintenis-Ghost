import formatting from './formatting';
import { fileMap, finalcount } from './calculations';

const { spawn } = window.bridge;

export default function gLog(path: string, doneCB: (fileMap: object, noOfFiles: number) => void, queryParameter: string) {
  const cmd = 'git';
  const cmdArgs = ['log', '--merges', '--numstat', '-m', '--first-parent', 'master', '--pretty=%cD', `--grep=${queryParameter}/`];

  // git command:
  // git log --merges --numstat -m --first-parent master --pretty=%cD --grep=bugfix/
  console.log(path);
  const gitLog = spawn(cmd, cmdArgs, { cwd: path });
  console.log(gitLog);

  let output = '';

  gitLog.stdout.on('data', (data) => {
    output += data.toString();
  });

  gitLog.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    formatting(output);
    if (code === 0) {
      console.log('child process complete.');
    } else {
      console.log(`child process exited with code ${code}`);
    }
    doneCB(fileMap, finalcount);
  });
}
