import { FileRequest } from '@esherr/file-server-protos'
// import { FileRequest } from '../../bazel-bin/projects/file-server/ts-protos-foo-generated/file'
// TODO turn this into something for ts, probably I need a src dir...

const main = () => {
    console.log("hey fileRequest is", FileRequest)
}
main()