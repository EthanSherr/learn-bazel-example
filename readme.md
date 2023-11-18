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
