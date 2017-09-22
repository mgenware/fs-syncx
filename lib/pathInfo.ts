export default class PathInfo {
  constructor(
    public name: string,
    public path: string,
    public fullPath: string,
    public isDir: boolean,
    public isFile: boolean,
    public stat: any) {}
}
