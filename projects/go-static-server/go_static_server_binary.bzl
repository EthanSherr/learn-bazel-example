load("@io_bazel_rules_go//go:def.bzl", "go_binary")

def go_static_server_binary(name, data, visibility = None, env = None):
    go_binary(
        name = name,
        srcs = ["//projects/go-static-server:srcs"],
        data = data,
        # importpath = "example.com/custom_registry/app",
        visibility = visibility,
        env = env,
        # Add more attributes as needed
    )
