load("@io_bazel_rules_go//go:def.bzl", "go_binary")

def go_static_server_binary(name, data, visibility = None):
    go_binary(
        name = name,
        srcs = ["main.go"],
        data = data,
        visibility = visibility,
        # Add more attributes as needed
    )
