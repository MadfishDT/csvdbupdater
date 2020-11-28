# singlemysqlcsv-cli
* **mysql update by csv**
* **singlemydqlcsv can update single column at once.**
* **not support multi column update**

**Install**
-
```
npm inatall singlemysqlcsv-cli
```

**Support features:**
-

- Update mysql single column
- Select key column
- Typescript support

**Update Logic**
-

- if mysql table name TableA have 3 Column CA, CB, CC and CA is main Key
- if A.csv have CSA key column and CSC column
- this module can be update column that one of TableA at once
- first of all select table
- second, select key column, this key column match to csv key column
- third, select table's column for update
- 4th, select csv file
- 5th, select csv key column, this key column match to db table key column
- 6th, select csv's column for update


**How to run**
-

* bin
    - global npm install
    ```
    singlemysqlcsv-cli
    ```
* code
    ```
    - npm run start
    ```
* running
    ```
        PS D:\dev\npms\csvupdater> npm run start                                                                                
    > singlemysqlcsv-cli@0.0.1 start D:\dev\npms\csvupdater
    > nodemon --watch src --delay 1 --exec ts-node src/index.ts

    [nodemon] 2.0.6
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): src\**\*
    [nodemon] watching extensions: ts,json
    [nodemon] starting `ts-node src/index.ts`
    ____  ____    _  ____ ______     ___     __  _ ____  ____  _   _   _           _       _          ___   _
    / ___|| __ )  ( )/ ___/ ___\ \   / ( )    \ \( )  _ \| __ )( ) | | | |_ __   __| | __ _| |_ ___   / _ \ / |
    \___ \|  _ \  |/| |   \___ \\ \ / /|/ _____\ \/| | | |  _ \|/  | | | | '_ \ / _` |/ _` | __/ _ \ | | | || |
    ___) | |_) |   | |___ ___) |\ V /   |_____/ / | |_| | |_) |   | |_| | |_) | (_| | (_| | ||  __/ | |_| || |
    |____/|____/     \____|____/  \_/         /_/  |____/|____/     \___/| .__/ \__,_|\__,_|\__\___|  \___(_)_|
                                                                        |_|
    => Target DB host(default "localhost")?
    => Target DB user? quser
    => Target DB password? quser
    => Target DB database? sessions
    => Source CSV file path?
    success connection 
    ```


**Build**
-
* Production mode build
    * all mode buid: bundle module and umd bundle module
        ```
        npm run build:prod:
        ```
    * all and patial mode buid:  bundle module and umd bundle module, this build option build each modules too. output are 1 all module bundled package and each module bundle package
        ```
        npm run build:prod:all
        ```
    * partial module build: 
        ```
        build:[module name]:prod
        /*module name can be 'gzip','zip','raw','flate'*/
        ```
* Development mode build(developing mode with file watch)

        ```
        build:dev
        ```

* package.json configration to **deply**
    * to deploy with package.json, you should change content in /npms/zlibt/package.json
    * /package.json file is not package config for deploy to npm package site

**deploy script**
-
    
* to deply source, you have to run pre-deploy script, this script aggregate source code that is in npm packages

    ```
        npm run predeploy:prod
    ```
* this script run './deploy/zlibt.js'

* Production mode build
    * production build support, just change dev->prod

**ZLib APIS**
-
* Zlib TypeScript

    **rawdeflate, rawinflate**
    ```ts
    import { RawDeflate, RawInflate } from 'zlibt2';

        //compress
        const datas = [1, 2, 3, 4, 5, 6];
        const rawDeflate = new RawDeflate(datas);
        const rawCompress = rawDeflate.compress();

        //decompress
        const rawInflate = new RawInflate(rawCompress);
        const rawPlain = rawInflate.decompress();
    ```

    **deflate, inflate**
    ```ts
    import { Deflate, Inflate } from 'zlibt2';

        //compress
        const datas = [1, 2, 3, 4, 5, 6];
        const deflate = new Deflate(datas);
        const compress = deflate.compress();

        //decompress
        const inflate = new Inflate(compress);
        const plain = inflate.decompress();
    ```

    **gzip, gunzip**
    ```ts
    import { RawDeflate, RawInflate } from 'zlibt2';

        //compress
        const datas = [1, 2, 3, 4, 5, 6];
        const gzip = new Gzip(datas);
        const compressed = gzip.compress();

        //decompress
        const gunzip = new Gunzip(compressed);
        const resultGZipArray = Array.from(gunzip.decompress());
    ```

    **pkzip, pkunzip(zip, unzip)**
    ```ts
    import { RawDeflate, RawInflate } from 'zlibt2';

        //compress
        const datas = [1, 2, 3, 4, 5, 6];
        const zip = new Zip();
        zip.addFile(datas, {
            filename: this.stringToByteArray('foo.txt')
        });
        const zipcompressed = zip.compress();
        const unzip = new Unzip(zipcompressed);
        const filenames =  unzip.getFilenames();
        const externalFA = unzip.getFileHeaderAttribute(filenames[0], 'externalFileAttributes');

        //get file mode from zip file
        const filemode = (externalFA >>> 16) & 0xffff;
        const resultUnzipArray = Array.from(unzip.decompress('foo.txt', null));
    ```

* Zlib JavaScript

    **rawdeflate, rawinflate**
    ```js
    const Zlib = require('zlibt2');

        const rawDeflate = new Zlib.RawDeflate(datas);
        const rawCompress = rawDeflate.compress();

        const rawInflate = new Zlib.RawInflate(rawCompress);
        const rawPlain = rawInflate.decompress();
        var resultRawArray = Array.from(rawPlain);
    ```

    **deflate, inflate**
    ```js
    const Zlib = require('zlibt2');

        const deflate = new Zlib.Deflate(datas);
        const compress = deflate.compress();

        const inflate = new Zlib.Inflate(compress);
        const plain = inflate.decompress();
        var resultArray = Array.from(plain);
    ```

    **gzip, gunzip**
    ```js
    const Zlib = require('zlibt2');

        var gzip = new Zlib.Gzip(datas);
        var compressed = gzip.compress();

        var gunzip = new Zlib.Gunzip(compressed);
        var resultGZipArray = Array.from(gunzip.decompress());
    ```

    **pkzip, pkunzip(zip, unzip)**
    ```js
    const Zlib = require('zlibt2');

        function stringToByteArray(str) {
            var array = new Uint8Array(str.length);
            var i;
            var il;
        
            for (i = 0, il = str.length; i < il; ++i) {
                array[i] = str.charCodeAt(i) & 0xff;
            }
        
            return array;
        }
        var zip = new Zlib.Zip();
        zip.addFile(datas, {
            filename: stringToByteArray('foo.txt')
        });
        var zipcompressed = zip.compress();
        var unzip = new Zlib.Unzip(zipcompressed);
        const filenames =  unzip.getFilenames();
        const externalFA = unzip.getFileHeaderAttribute('foo.txt', 'externalFileAttributes');
        const filemode = (externalFA >>> 16) & 0xffff;
        var resultUnzipArray = Array.from(unzip.decompress('foo.txt'));
    ```

* Zlib Web
    
    - support all object RawDeflate, RawInflate, Zip, Unzip, Gzip, Gunzip

    **example zlib code**
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <script src="zlibt.umd.js" type="application/javascript"></script>
        </head>
    <body>

    <h1>zlib Test Page</h1>
    <p>My first paragraph.</p>

    <script>
        const datas = [1, 2, 3, 4, 5, 6];
        //zlib test
        console.log(`raw input data: ${datas}`);
        const rawDeflate = new RawDeflate(datas);
        const rawCompress = rawDeflate.compress();

        const rawInflate = new RawInflate(rawCompress);
        const rawPlain = rawInflate.decompress();
        var resultRawArray = Array.from(rawPlain);
        console.log(`raw uncompress result: ${resultRawArray}`);
    </script> 
    </body>
    </html>
    ```

* Zlib Compress Options

    ```js
    {
        compressionType: Zlib.Deflate.CompressionType, // compression type
        lazy: number // lazy matching parameter
    }
    ```

* Zlib Decompress Options

    ```js
    {
        'index': number, // start position in input buffer 
        'bufferSize': number, // initial output buffer size
        'bufferType': Zlib.Inflate.BufferType, // buffer expantion type
        'resize': boolean, // resize buffer(ArrayBuffer) when end of decompression (default: false)
        'verify': boolean  // verify decompression result (default: false)
    }
    ```

* GZip Compress Options

    ```js
    {
        deflateOptions: Object, // see: deflate option (ZLIB Option)
        flags: {
            fname: boolean, // use filename?
            comment: boolean, // use comment?
            fhcrc: boolean // use file checksum?
        },
        filename: string, // filename
        comment: string // comment
    }
    ```

**unzip get file header attrubute function**
-

* support attribute name
    1. 'needVersion'
    2. 'flags'
    3. 'compression'
    4. 'time'
    5. 'date'
    6. 'crc32'
    7. 'compressedSize'
    8. 'plainSize'
    9. 'internalFileAttributes'
    10. 'externalFileAttributes'

    * how to get file permission number like '0o777'
    ```js
    const unzip = new Zlib.Unzip(compressed, null);
    const filenames =  unzip.getFilenames();
    const externalFA = unzip.getFileHeaderAttribute(filenames[0], 'externalFileAttributes');
    const filemode = (externalFA >>> 16) & 0xffff;
    ```
