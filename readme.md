# Cool!


## build
> bazel build ...

## 
> bazel test ...

## run
> bazel run projects/my_python_app



- [python py_binary, py_library, pip_parse](https://www.youtube.com/watch?v=qiZXFdd8OPo&list=PLdk2EmelRVLovmSToc_DK7F1DV_ZEljbx&index=2)
- [last lesson](https://www.youtube.com/watch?v=qiZXFdd8OPo&list=PLdk2EmelRVLovmSToc_DK7F1DV_ZEljbx&index=3)



## [10-29-2023] I've built rules_js js_binary, trying to figure out how to build js_run_binary
## [11-17-2023] i've got node-js-project running a binary but not yet npm modules

I'm stuck... I thought I should set it up like a pnpm-workspace just now, and i'm tyring to require("is-odd") in node-js-project/index.js and do a js_binary but when I build I see

```sh
DEBUG: /home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_js/npm/private/npm_translate_lock_state.bzl:266:14: 
WARNING: Implicitly using .npmrc file `//:.npmrc`.
        Set the `npmrc` attribute of `npm_translate_lock(name = "npm")` to `//:.npmrc` suppress this warning.
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/node-js-project/BUILD.bazel:4:22: no such target '//:.aspect_rules_js/node_modules/is-odd@3.0.1': target '.aspect_rules_js/node_modules/is-odd@3.0.1' not declared in package '' defined by /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/BUILD.bazel and referenced by '//projects/node-js-project:node_modules/is-odd'
ERROR: Analysis of target '//projects/node-js-project:applib' failed; build aborted: 
INFO: Elapsed time: 0.093s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (2 packages loaded, 4 targets configured)
    currently loading: @go_sdk_toolchains//
```
trying to use :node_modules/is-odd as a dep of js_library... I'm sad


AH I resolved it... I needed to have a 
```py
load("@npm//:defs.bzl", "npm_link_all_packages")

npm_link_all_packages()
```
at the root.  This was an insanely useful read: 
[hackmd.io presentation on rules_js](https://hackmd.io/@aspect/rules_js?print-pdf#/)
[stack overflow answer overview by Toxaris](https://stackoverflow.com/questions/75445658/how-to-setup-a-bazel-workspace-with-rules-js-for-a-monorepo-with-multiple-pack)
x [docs](https://docs-legacy.aspect.build/aspect-build/rules_js/v1.0.0-rc.1/docs/npm_import-docgen.html)
[rules_nodejs readme.md](https://docs.aspect.build/rulesets/rules_nodejs)

I'm trying to figure out how to use "type": "module" ESM syntax in node-js-project/index.js
But do I really care?  I mean I'll be using typescript anyway.


## [2023-11-18]
[rules_ts docs](hthttps://docs.aspect.build/rulesets/aspect_rules_ts)
[rules_ts installation](https://github.com/aspect-build/rules_ts/releases)

### skipLibCheck, linked to tsconfig
```sh
######## Required Typecheck Performance Selection ########

TypeScript's type-checking exposes a flag `--skipLibCheck`:
https://www.typescriptlang.org/tsconfig#skipLibCheck

Using this flag saves substantial time during type-checking.
Rather than doing a full check of all d.ts files, TypeScript will only type-check the code you
specifically refer to in your app's source code.
We recommend this for most rules_ts users.

HOWEVER this performance improvement comes at the expense of type-system accuracy. 
For example, two packages could define two copies of the same type in an inconsistent way.
If you publish a library from your repository, your incorrect types may result in errors for your users.

You must choose exactly one of the following flags:

1. To choose the faster performance put this in /.bazelrc:

    # passes an argument `--skipLibCheck` to *every* spawn of tsc
    build --@aspect_rules_ts//ts:skipLibCheck=always
    fetch --@aspect_rules_ts//ts:skipLibCheck=always
    query --@aspect_rules_ts//ts:skipLibCheck=always

2. To choose more correct typechecks, put this in /.bazelrc:

    # honor the setting of `skipLibCheck` in the tsconfig.json file
    build --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
    fetch --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
    query --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
```

I've opted for 2.


### need to pick a transpiler

```sh
esherr@laptop-esherr01:~/personal/learn-bazel/multi-language-repo$ bazel build ...
DEBUG: /home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_js/npm/private/npm_translate_lock_state.bzl:266:14: 
WARNING: Implicitly using .npmrc file `//:.npmrc`.
        Set the `npmrc` attribute of `npm_translate_lock(name = "npm")` to `//:.npmrc` suppress this warning.
INFO: Build option --@aspect_rules_ts//ts:skipLibCheck has changed, discarding analysis cache.
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/my-ts-project/BUILD.bazel:7:11: in ts_project rule //projects/my-ts-project:something_something: 
Traceback (most recent call last):
        File "/home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_ts/ts/private/ts_project.bzl", line 230, column 21, in _ts_project_impl
                fail(transpiler_selection_required)
Error in fail: 
######## Required Transpiler Selection ########

You must select a transpiler for ts_project rules, which produces the .js outputs.

Please read https://docs.aspect.build/rules/aspect_rules_ts/docs/transpiler

##########################################################
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/my-ts-project/BUILD.bazel:7:11: Analysis of target '//projects/my-ts-project:something_something' failed
ERROR: Analysis of target '//projects/my-ts-project:something_something' failed; build aborted: 
INFO: Elapsed time: 0.478s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (0 packages loaded, 11177 targets configured)
```

[transpiling typescript to javascript](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/transpiler/)

```
The TypeScript compiler tsc can perform type-checking, transpilation to JavaScript, or both. Type-checking is typically slow, and is really only possible with TypeScript, not with alternative tools. Transpilation is mostly "erase the type syntax" and can be done well by a variety of tools.

ts_project allows us to split the work, with the following design goals:

The user should only need a single BUILD.bazel declaration: "these are my TypeScript sources and their dependencies".
Most developers have a working TypeScript Language Service in their editor, so they got type hinting before they ran bazel.
Development activities which rely only on runtime code, like running tests or manually verifying behavior in a devserver, should not need to wait on type-checking.
Type-checking still needs to be verified before checking in the code, but only needs to be as fast as a typical test.
Read more: https://blog.aspect.dev/typescript-speedup
```

all that was needed was including swc in the ts_project, and correctly linking the tsconfigs, then aligning some properties to match tsconfig settings.


more info
[aspect-rules-ts](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/rules)


Finally, I just learned I could use a ts_project as a dependency for a js_binary rule, and run it after compilation.  FUCK YES. 

[an exmaple of liba, libb underneath a ts root](https://github.com/aspect-build/rules_ts/blob/main/examples/project_references/lib_a/BUILD.bazel)

[an example of craco integration](https://github.com/bazelbuild/examples/blob/main/frontend/react/BUILD.bazel)

[maybe a better example of pnpm workspace bzl](https://github.com/aspect-build/bazel-examples/blob/main/pnpm-workspaces/apps/alpha/src/main.ts)



## [2023-11-19] swc & tsc

I was trying to use the swc compilation (with each project having a tsconfig extending a base tsconfig.)
The tsconfigs were building to commonjs - but when I ran my bazel build, outputs still had ESM syntax.  What's the deal?
The deal is swc doesn't automatically sync with tsconfig. [read about aspect_rules_ts docs transpiler choices](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/transpiler/).  SWC is recommended due to its speed - probably a good candidate when it comes to dev related things, but I don't think it does type checking saddly!  Running compilations with only SWC (not linked to tsconfigs) restuled in errors about "can't use module style import outside of module".  I feel I could've started putting package.json>type: module everywhere but instead I tried to figure out the root cause.  I saw that the .js files generated were ESM, although my tsconfig said commonjs, and went back to check my configurations.  I ended up adding  the following to my bazelrc

```
# Use "tsc" as the transpiler when ts_project has no `transpiler` set.
build --@aspect_rules_ts//ts:default_to_tsc_transpiler
fetch --@aspect_rules_ts//ts:default_to_tsc_transpiler
query --@aspect_rules_ts//ts:default_to_tsc_transpiler
```

and removed ts_project attribute: transpiler.



## [2023-11-23] react example

Well I got react working inside bazel, using the CRA example found here


I needed a reminder about js_run_devserver rule, which may require some additional config in the workspace - in order to link to a script... [check it out here](https://docs.aspect.build/rulesets/aspect_rules_js/docs/js_run_devserver/) it dsecribes the process of getting a bin entry point for your node modules that are cli's.

This is feeling pretty great!  But there's sort of a problem.  I'm not seeing updates in my frontend, and i'm seeing compilations like


```sh
> ibazel run //projects/react-project:start

Compiled successfully!

You can now view create-react-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.0.0.13:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Scratch'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Video'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Cache'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/Log'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/archive'
Watchpack Error (initial scan): Error: ENODEV: no such device, lstat '/work'

```

[potentially good read](https://blog.engflow.com/2023/10/16/coding-in-the-fast-lane-with-ibazel/)


## [2023-11-24] trouble with ibazel

when I ran ibazel, i'd see 2 errors in .bazelrc - syntax errors from ibazel.  this was only true of ibazel, not of bazel run nor bazel build.
I referred to aspect_rules documentation, since that's the syntax error in the bazelrc, thought about providing this config another awy - but ultimately
I realized that my .bazelversion was 5.4.0, but the latest bazel is 6.4.0;  time to upgrade right?  After and upgrade the problem went away.

I'm still not clear if ibazel is provded by bazel cli.  I'm also a little confused because doing `which bazel` or `which ibazel` it'll point to `/bdi/rt/scripts/*`. 
However I'm starting to think that bazelisk helps me out here in this repo.  Running `bazel version` in this repo shows me versions corresponding to the .bazelversion.
running `bazel version` outside of this dir shows me the bazel version of $bdi

SO that's that!  bazelisk! :)  learn more about it eh?

Yay


[2023-11-30] pip rules (deps) aren't quite right
I'm on my mac on a fresh slate, I try to `bazel build ...` but there's an error
about missing "python_deps_*"
for the following python deps

```sh
importlib_metadata==6.8.0
zipp==3.17.0
```

I was a little confused at first and revisited python_rules documentation, I feel there's a rule like

```py
    load("@rules_python//python:pip.bzl", "compile_pip_requirements")
```

which may be used to pull in requirements, i'm not sure.  But what's weird is that these deps weren't pulled in from my first list.  Maybe I had those locally on my other comp?  argg!  That means the deps aren't really sealed.  unsure.  I added deps to my /third-party/requirements_lock.yaml but I feel there's something to be learned [here](https://github.com/bazelbuild/rules_python/blob/main/examples/pip_parse/BUILD.bazel)

Also reading in the docs there may be some hermetic issues [here](https://rules-python.readthedocs.io/en/latest/getting-started.html#using-a-workspace-file)

in all the confusion I made requirements.in but i'm not really using it.


VITE: https://github.com/bazelbuild/examples/tree/main/frontend/vue



using data for copying to bin - recursing through file group structure sucks
https://stackoverflow.com/questions/38905256/bazel-copy-multiple-files-to-binary-directory

bazel cquery //: --output=files

[12/3/2023]
I made a vite react app which has a dev server, but also I made a static golang server that caches everything except index.html.  Perhaps these cached times need to be less than 1 year but I like the idea of the bundle being cached forevs.  I can use this during deployment instead of nginx, and maybe I'll set up a distroless build for my static react webapps from now on.

I learned how to shell into a :debug distroless image, with `docker run --entrypoint=sh -ti coolimg`

I've also learned that the go_binary's name "app" is also going to the the image's "entrypoint"

Problem:

exec /app: exec format error

```json
[
    {
        "Id": "sha256:e77a5a1369988f124adcaee385071e0dfd8efaf3f468ce967352246a56be5372",
        "RepoTags": [
            "coolimg:latest"
        ],
        "RepoDigests": [],
        "Parent": "",
        "Comment": "",
        "Created": "0001-01-01T00:00:00Z",
        "Container": "",
        "ContainerConfig": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": null,
            "Cmd": null,
            "Image": "",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": null
        },
        "DockerVersion": "",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "0",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/busybox",
                "SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt"
            ],
            "Cmd": null,
            "Image": "",
            "Volumes": null,
            "WorkingDir": "/",
            "Entrypoint": [
                "/app"
            ],
            "OnBuild": null,
            "Labels": null
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 26572476,
        "VirtualSize": 26572476,
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/2ac201a458aec092ccbaacd7ebb67e101632561cd6f8762c1bac069238bf2f83/diff:/var/lib/docker/overlay2/ebf3e0d65f99b0ad7be258f9b296b480e832a5b42dcf458efc22cf77eae8ee0d/diff:/var/lib/docker/overlay2/581fdebca22ea65afb02dc6b39916ac8ceb5ba10f97b29f8b2f0540d9a74376a/diff:/var/lib/docker/overlay2/1fbe86d4d50417af58be476aa894d682077d2656996df15ef4b2b546f34d155c/diff:/var/lib/docker/overlay2/7963f30506316a1298ef98987cc25727614354082d03c0b2269a4146a5a235d1/diff:/var/lib/docker/overlay2/ea0098b1c0582142a8e90a3f70bc666973988b3780af3d0bdb2f0ad6eb39825c/diff:/var/lib/docker/overlay2/9030639a6fda6712c13bbd102fec6978d737166bf09a709934787c8ce20e1188/diff:/var/lib/docker/overlay2/6ad828d8e3492189ccaf83502d73f61394249b395dd9b38440c2e0e2e503d6db/diff:/var/lib/docker/overlay2/2832e97df896d86a753a916621625967eb826adce47bb924742b25393671f82b/diff:/var/lib/docker/overlay2/8d63eb18e43f3a9fe7c7537c1a9118e615a12d5414cc4f4213a846dd25b29af9/diff:/var/lib/docker/overlay2/f1a77baad8cf303fdedf5f40dd03c47d70aab3630feebe63dbe638510b455993/diff:/var/lib/docker/overlay2/6950be000d127247e6b806df7a5b1907458492562aae1ecbef50129b24012034/diff:/var/lib/docker/overlay2/c4d35c3a94a268399a1ac50348cdaa1f9dbff55272c7fcde9d0929ffd5f90b73/diff",
                "MergedDir": "/var/lib/docker/overlay2/06e75955dc550d1d56e4a6d32e9c0266e27313b4ff9c11a5a8ee6ea1e74443bb/merged",
                "UpperDir": "/var/lib/docker/overlay2/06e75955dc550d1d56e4a6d32e9c0266e27313b4ff9c11a5a8ee6ea1e74443bb/diff",
                "WorkDir": "/var/lib/docker/overlay2/06e75955dc550d1d56e4a6d32e9c0266e27313b4ff9c11a5a8ee6ea1e74443bb/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:54ad2ec71039b74f7e82f020a92a8c2ca45f16a51930d539b56973a18b8ffe8d",
                "sha256:6fbdf253bbc2490dcfede5bdb58ca0db63ee8aff565f6ea9f918f3bce9e2d5aa",
                "sha256:7bea6b893187b14fc0a759fe5f8972d1292a9c0554c87cbf485f0947c26b8a05",
                "sha256:ff5700ec54186528cbae40f54c24b1a34fb7c01527beaa1232868c16e2353f52",
                "sha256:d52f02c6501c9c4410568f0bf6ff30d30d8290f57794c308fe36ea78393afac2",
                "sha256:e624a5370eca2b8266e74d179326e2a8767d361db14d13edd9fb57e408731784",
                "sha256:1a73b54f556b477f0a8b939d13c504a3b4f4db71f7a09c63afbc10acb3de5849",
                "sha256:d2d7ec0f6756eb51cf1602c6f8ac4dd811d3d052661142e0110357bf0b581457",
                "sha256:4cb10dd2545bd173858450b80853b850e49608260f1a0789e0d0b39edf12f500",
                "sha256:f33e343848bd9064955eb26f7cdaa1a313116ff7cbae32b1b539dbcee622a593",
                "sha256:714f56238fb5a6e9cde67167648f2d4af7702c2fa07b9de428970fb9b0693e4c",
                "sha256:c8beeff22ce7a27d75ad5f57277fc1859f7107f02a2c0548b9e892fe53fffb5d",
                "sha256:c1ccea363d309ca278c59dc8f3755b539238d4f200217c33eef04ee37e1c01c3",
                "sha256:be9dc4f8ce204bc0f281ae078298db33c2daa11381c0695c14da633d461d78ba"
            ]
        },
        "Metadata": {
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
    }
]
```

what arch is my docker vm?
`docker system info | grep -i "OSType\|Architecture"`

oci_pull : architectures
for multi-architecture images, a dictionary of the platforms it supports This creates a separate external repository for each platform, avoiding fetching layers.m

SOLVED: [this link](https://stackoverflow.com/questions/73285601/docker-exec-usr-bin-sh-exec-format-error) helped me realize my go was compiled to run on my mac - but needed to be compiled to run on linux/amd64 which is equal to my docker vm's architecture.  Normally this is done with GOOS param of "go build" tool [see here](https://stackoverflow.com/questions/52939149/exec-format-error-with-docker-run-command): `env GOOS=linux go build  -o ../bin` but in my world I am using rules_go.  I went to see if go_binary had any way of setting the architecture of GOOS and it does have attributes `goarch` and `goos` which you can [see here](https://github.com/bazelbuild/rules_go/blob/master/docs/go/core/rules.md#go_binary-goos) they recommend setting a --platforms param to set arch instead of forcing the rule to use a certain arch - for more information [see crosscompilation](https://github.com/bazelbuild/rules_go/blob/master/docs/go/core/cross_compilation.md#cross-compilation).  Now my images will run! yes.

I'm running with: `docker run -e STATIC_DIR=/usr/share/static/html -e PORT=3000 -p 3000:3000 coolimg`
Slight problem because i need to actually do `/usr/share/static/html/dist`