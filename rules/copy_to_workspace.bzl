load("@bazel_skylib//rules:write_file.bzl", "write_file")

# copies some target files to workspace.
# _GENERATED = {
#    "//projects/file-server-protos:" + base_name + ".ts": "projects/file-server-protos",
#    "//projects/file-server-protos:" + "index.ts": "projects/file-server-protos",
#    # ...
# }
def copy_to_workspace(name, map):
    write_file(
        name = "write_copy_sh",
        out = "copy.sh",
        content = [
            # This depends on bash, would need tweaks for Windows
            "#!/usr/bin/env bash",
            # Bazel gives us a way to access the source folder!
            "cd $BUILD_WORKSPACE_DIRECTORY",
            "echo $BUILD_WORKSPACE_DIRECTORY",
        ] + [
            # Paths are now relative to the workspace.
            # We can copy files from bazel-bin to the sources
            "cp -fv bazel-bin/{0} {1}".format(
                # Convert label to path
                k.replace(":", "/"),
                v,
            )
            for [
                k,
                v,
            ] in map.items()
        ],
    )

    native.sh_binary(
        name = name,
        srcs = ["copy.sh"],
        data = map.keys(),
    )
