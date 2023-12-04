load("@rules_pkg//pkg:tar.bzl", "pkg_tar")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_tarball")

def go_static_server_tarball(name, vite_tar_srcs, repo_tags):
    pkg_tar(
        name = "static-server-tar",
        srcs = ["//projects/go-static-server:static-server"],
    )

    pkg_tar(
        name = "static-tar",
        srcs = vite_tar_srcs,
        package_dir = "/usr/share/static/html",
    )

    oci_image(
        name = "frontend-image",
        base = "@distroless_base",
        entrypoint = ["/static-server"],
        tars = [
            ":static-server-tar",
            ":static-tar",
        ],
    )

    oci_tarball(
        name = name,
        image = ":frontend-image",
        repo_tags = repo_tags,
    )
