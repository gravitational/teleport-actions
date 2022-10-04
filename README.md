<div align="center">
   <img src="./assets/img/readme-header.png" width=750/>
   <div align="center" style="padding: 25px">
      <a href="https://www.apache.org/licenses/LICENSE-2.0">
      <img src="https://img.shields.io/badge/Apache-2.0-red.svg" />
      </a>
   </div>
</div>
</br>

> Read our Blog: <https://goteleport.com/blog/>

> Read our Documentation: <https://goteleport.com/docs/getting-started/>

## Table of Contents

1. [Introduction](#introduction)
1. [Actions](#actions)

## Introduction

`teleport-actions` is a collection of handy GitHub Actions to use within your
workflows when trying to interact with resources protected by Teleport 🚀.

This project is currently experimental and more information about
`teleport-actions` will arrive soon.

## Actions

### `@gravitational/teleport-actions/setup`

`@gravitational/teleport-actions/setup` installs key Teleport binaries into
your workflow environment, for example `tctl`, `tsh` and `tbot`.

The GitHub Actions cache is leveraged to increase the speed of this action.
