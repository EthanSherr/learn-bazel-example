load("@npm//:grpc-tools/package_json.bzl", grpc_tools_bin = "bin")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")
load("@aspect_rules_js//npm:defs.bzl", "npm_package")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def nice_grpc_proto(name, chdir):
    # npm_link_all_packages()
    file_name = "file"

    SRCS = [
        "proto/file.proto",
    ]

    BUILD_DEPS = ["//:node_modules/" + d for d in [
        "long",
        "nice-grpc",
        "nice-grpc-common",
        "protobufjs",
        "ts-proto",
        "grpc-tools",
    ]]

    grpc_tools_bin.grpc_tools_node_protoc(
        name = "ts_protos_foo",
        srcs = SRCS + BUILD_DEPS,
        args = [
            "--plugin=protoc-gen-ts_proto=../../node_modules/.bin/protoc-gen-ts_proto",
            "--ts_proto_out=./ts-protos-foo-generated",
            "--ts_proto_opt=outputServices=nice-grpc,outputServices=generic-definitions,useExactTypes=true,outputPartialMethods=false,oneof=unions",
            "--proto_path=./proto",
            "./proto/file.proto",
        ],
        chdir = chdir,
        # out_dirs = ["ts_protos_foo"],
        outs = ["ts-protos-foo-generated/file.ts"],
        visibility = ["//visibility:public"],
    )

    write_file(
        name = "ts_protos_lib_index",
        out = "ts-protos-foo-generated/index.ts",
        content = ["export * from \"./{}\";".format(file_name)],
    )

    ts_project(
        name = "ts_protos_lib",
        srcs = [
            "ts-protos-foo-generated/index.ts",
            "ts-protos-foo-generated/file.ts",
        ],
        declaration = True,
        source_map = True,
        tsconfig = ":config",
        deps = BUILD_DEPS,
        # transpiler = swc,
        # deps = [":ts_protos"],
    )

    write_file(
        name = "ts_protos_lib_package_json",
        out = "ts-protos-foo-generated/package.json",
        content = [
            """{
    "name": "@esherr/%s",
    "description": "a generated ts_proto",
    "scripts": {},
    "devDependencies": {},
    "author": "",
    "license": "ISC"
}""" % "ts-protos-foo-generated",
        ],
    )

    # i had an idea to generate build files in the out tree, that's fucked up

    # write_file(
    #     name = "ts_protos_lib_build_bazel",
    #     out = "ts-protos-foo-generated/BUILD.bazel",
    #     content = ["# empty"],
    # )

    npm_package(
        name = "file_proto",
        srcs = [
            ":ts_protos_lib",
            ":ts_protos_lib_package_json",
            # ":ts_protos_lib_build_bazel",
        ],
        visibility = ["//visibility:public"],
    )
