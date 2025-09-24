// Global type declarations for packages that may not have proper type definitions
/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'minimatch' {
  export = minimatch;
  declare function minimatch(target: string, pattern: string, options?: any): boolean;
  declare namespace minimatch {
    export interface Options {
      debug?: boolean;
      nobrace?: boolean;
      noglobstar?: boolean;
      dot?: boolean;
      noext?: boolean;
      nocase?: boolean;
      nonull?: boolean;
      matchBase?: boolean;
      nocomment?: boolean;
      nonegate?: boolean;
      flipNegate?: boolean;
      partial?: boolean;
      allowWindowsEscape?: boolean;
    }
  }
}

declare module 'glob' {
  export = glob;
  declare function glob(pattern: string, options?: any, cb?: (err: Error | null, matches: string[]) => void): any;
  declare namespace glob {
    export interface Options {
      cwd?: string;
      root?: string;
      dot?: boolean;
      nomount?: boolean;
      mark?: boolean;
      nosort?: boolean;
      stat?: boolean;
      silent?: boolean;
      strict?: boolean;
      cache?: {[path: string]: any};
      statCache?: {[path: string]: any};
      symlinks?: {[path: string]: boolean};
      nounique?: boolean;
      nonull?: boolean;
      debug?: boolean;
      nobrace?: boolean;
      noglobstar?: boolean;
      noext?: boolean;
      nocase?: boolean;
      matchBase?: boolean;
      nodir?: boolean;
      ignore?: string | string[];
      follow?: boolean;
      realpath?: boolean;
      nonegate?: boolean;
      nocomment?: boolean;
      absolute?: boolean;
    }
  }
}