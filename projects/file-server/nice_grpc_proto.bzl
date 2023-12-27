load("@npm//:grpc-tools/package_json.bzl", grpc_tools_bin = "bin")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

def nice_grpc_proto(name, chdir):
    # print("hello 3 {}".format(name))
    # npm_link_all_packages()

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
            "--ts_proto_out=./ts_protos_foo",
            "--ts_proto_opt=outputServices=nice-grpc,outputServices=generic-definitions,useExactTypes=true,outputPartialMethods=false,oneof=unions",
            "--proto_path=./proto",
            "./proto/file.proto",
        ],
        chdir = chdir,
        # out_dirs = ["ts_protos_foo"],
        outs = ["ts_protos_foo/file.ts"],
        visibility = ["//visibility:public"],
    )

    ts_project(
        name = "ts_protos_lib",
        srcs = [
            "ts_protos_foo/file.ts",
        ],
        declaration = True,
        source_map = True,
        tsconfig = ":config",
        deps = BUILD_DEPS,

        # transpiler = swc,
        # deps = [":ts_protos"],
    )

    # native.genrule(
    #     name = "collect_ts_files",
    #     outs = ["collected_ts_files.txt"],
    #     cmd = "echo $(location :ts_protos_foo) > $@",
    #     tools = [":ts_protos_foo"],
    # )

    # native.genrule(
    #     name = "consume_ts_files",
    #     srcs = ["collected_ts_files.txt"],
    #     outs = ["final_output.js"],
    #     cmd = """
    #     # Read the list of .ts files from collected_ts_files.txt and perform your desired operations
    #     ts_files=$(cat $<)
    #     # Your command to process the .ts files and produce final_output.js
    #     # Example: tsc $ts_files --outDir=$(@D)
    #     """,
    #     deps = [":collect_ts_files"],
    # )

# genrule(
#     name = "gen_rule_foo",
#     srcs = [],
#     outs = ["compiled_output.txt"],
#     cmd = "echo hello",
#     deps = [],
# )
