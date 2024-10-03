/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignInImport } from './routes/sign-in'
import { Route as AuthedImport } from './routes/_authed'
import { Route as AuthedLayoutImport } from './routes/_authed/_layout'
import { Route as AuthedLayoutIndexImport } from './routes/_authed/_layout.index'
import { Route as AuthedTicketLayoutImport } from './routes/_authed/ticket/_layout'
import { Route as AuthedLayoutUnassignedImport } from './routes/_authed/_layout.unassigned'
import { Route as AuthedLayoutSettingsImport } from './routes/_authed/_layout.settings'
import { Route as AuthedLayoutReportsImport } from './routes/_authed/_layout.reports'
import { Route as AuthedLayoutMyInboxImport } from './routes/_authed/_layout.my-inbox'
import { Route as AuthedTicketLayoutTicketIdImport } from './routes/_authed/ticket/_layout.$ticketId'

// Create Virtual Routes

const AuthedTicketImport = createFileRoute('/_authed/ticket')()

// Create/Update Routes

const SignInRoute = SignInImport.update({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const AuthedRoute = AuthedImport.update({
  id: '/_authed',
  getParentRoute: () => rootRoute,
} as any)

const AuthedTicketRoute = AuthedTicketImport.update({
  path: '/ticket',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedLayoutRoute = AuthedLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedLayoutIndexRoute = AuthedLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => AuthedLayoutRoute,
} as any)

const AuthedTicketLayoutRoute = AuthedTicketLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthedTicketRoute,
} as any)

const AuthedLayoutUnassignedRoute = AuthedLayoutUnassignedImport.update({
  path: '/unassigned',
  getParentRoute: () => AuthedLayoutRoute,
} as any)

const AuthedLayoutSettingsRoute = AuthedLayoutSettingsImport.update({
  path: '/settings',
  getParentRoute: () => AuthedLayoutRoute,
} as any)

const AuthedLayoutReportsRoute = AuthedLayoutReportsImport.update({
  path: '/reports',
  getParentRoute: () => AuthedLayoutRoute,
} as any)

const AuthedLayoutMyInboxRoute = AuthedLayoutMyInboxImport.update({
  path: '/my-inbox',
  getParentRoute: () => AuthedLayoutRoute,
} as any)

const AuthedTicketLayoutTicketIdRoute = AuthedTicketLayoutTicketIdImport.update(
  {
    path: '/$ticketId',
    getParentRoute: () => AuthedTicketLayoutRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authed': {
      id: '/_authed'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthedImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    '/_authed/_layout': {
      id: '/_authed/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthedLayoutImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/_layout/my-inbox': {
      id: '/_authed/_layout/my-inbox'
      path: '/my-inbox'
      fullPath: '/my-inbox'
      preLoaderRoute: typeof AuthedLayoutMyInboxImport
      parentRoute: typeof AuthedLayoutImport
    }
    '/_authed/_layout/reports': {
      id: '/_authed/_layout/reports'
      path: '/reports'
      fullPath: '/reports'
      preLoaderRoute: typeof AuthedLayoutReportsImport
      parentRoute: typeof AuthedLayoutImport
    }
    '/_authed/_layout/settings': {
      id: '/_authed/_layout/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthedLayoutSettingsImport
      parentRoute: typeof AuthedLayoutImport
    }
    '/_authed/_layout/unassigned': {
      id: '/_authed/_layout/unassigned'
      path: '/unassigned'
      fullPath: '/unassigned'
      preLoaderRoute: typeof AuthedLayoutUnassignedImport
      parentRoute: typeof AuthedLayoutImport
    }
    '/_authed/ticket': {
      id: '/_authed/ticket'
      path: '/ticket'
      fullPath: '/ticket'
      preLoaderRoute: typeof AuthedTicketImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/ticket/_layout': {
      id: '/_authed/ticket/_layout'
      path: '/ticket'
      fullPath: '/ticket'
      preLoaderRoute: typeof AuthedTicketLayoutImport
      parentRoute: typeof AuthedTicketRoute
    }
    '/_authed/_layout/': {
      id: '/_authed/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthedLayoutIndexImport
      parentRoute: typeof AuthedLayoutImport
    }
    '/_authed/ticket/_layout/$ticketId': {
      id: '/_authed/ticket/_layout/$ticketId'
      path: '/$ticketId'
      fullPath: '/ticket/$ticketId'
      preLoaderRoute: typeof AuthedTicketLayoutTicketIdImport
      parentRoute: typeof AuthedTicketLayoutImport
    }
  }
}

// Create and export the route tree

interface AuthedLayoutRouteChildren {
  AuthedLayoutMyInboxRoute: typeof AuthedLayoutMyInboxRoute
  AuthedLayoutReportsRoute: typeof AuthedLayoutReportsRoute
  AuthedLayoutSettingsRoute: typeof AuthedLayoutSettingsRoute
  AuthedLayoutUnassignedRoute: typeof AuthedLayoutUnassignedRoute
  AuthedLayoutIndexRoute: typeof AuthedLayoutIndexRoute
}

const AuthedLayoutRouteChildren: AuthedLayoutRouteChildren = {
  AuthedLayoutMyInboxRoute: AuthedLayoutMyInboxRoute,
  AuthedLayoutReportsRoute: AuthedLayoutReportsRoute,
  AuthedLayoutSettingsRoute: AuthedLayoutSettingsRoute,
  AuthedLayoutUnassignedRoute: AuthedLayoutUnassignedRoute,
  AuthedLayoutIndexRoute: AuthedLayoutIndexRoute,
}

const AuthedLayoutRouteWithChildren = AuthedLayoutRoute._addFileChildren(
  AuthedLayoutRouteChildren,
)

interface AuthedTicketLayoutRouteChildren {
  AuthedTicketLayoutTicketIdRoute: typeof AuthedTicketLayoutTicketIdRoute
}

const AuthedTicketLayoutRouteChildren: AuthedTicketLayoutRouteChildren = {
  AuthedTicketLayoutTicketIdRoute: AuthedTicketLayoutTicketIdRoute,
}

const AuthedTicketLayoutRouteWithChildren =
  AuthedTicketLayoutRoute._addFileChildren(AuthedTicketLayoutRouteChildren)

interface AuthedTicketRouteChildren {
  AuthedTicketLayoutRoute: typeof AuthedTicketLayoutRouteWithChildren
}

const AuthedTicketRouteChildren: AuthedTicketRouteChildren = {
  AuthedTicketLayoutRoute: AuthedTicketLayoutRouteWithChildren,
}

const AuthedTicketRouteWithChildren = AuthedTicketRoute._addFileChildren(
  AuthedTicketRouteChildren,
)

interface AuthedRouteChildren {
  AuthedLayoutRoute: typeof AuthedLayoutRouteWithChildren
  AuthedTicketRoute: typeof AuthedTicketRouteWithChildren
}

const AuthedRouteChildren: AuthedRouteChildren = {
  AuthedLayoutRoute: AuthedLayoutRouteWithChildren,
  AuthedTicketRoute: AuthedTicketRouteWithChildren,
}

const AuthedRouteWithChildren =
  AuthedRoute._addFileChildren(AuthedRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthedLayoutRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/my-inbox': typeof AuthedLayoutMyInboxRoute
  '/reports': typeof AuthedLayoutReportsRoute
  '/settings': typeof AuthedLayoutSettingsRoute
  '/unassigned': typeof AuthedLayoutUnassignedRoute
  '/ticket': typeof AuthedTicketLayoutRouteWithChildren
  '/': typeof AuthedLayoutIndexRoute
  '/ticket/$ticketId': typeof AuthedTicketLayoutTicketIdRoute
}

export interface FileRoutesByTo {
  '': typeof AuthedRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/my-inbox': typeof AuthedLayoutMyInboxRoute
  '/reports': typeof AuthedLayoutReportsRoute
  '/settings': typeof AuthedLayoutSettingsRoute
  '/unassigned': typeof AuthedLayoutUnassignedRoute
  '/ticket': typeof AuthedTicketLayoutRouteWithChildren
  '/': typeof AuthedLayoutIndexRoute
  '/ticket/$ticketId': typeof AuthedTicketLayoutTicketIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authed': typeof AuthedRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/_authed/_layout': typeof AuthedLayoutRouteWithChildren
  '/_authed/_layout/my-inbox': typeof AuthedLayoutMyInboxRoute
  '/_authed/_layout/reports': typeof AuthedLayoutReportsRoute
  '/_authed/_layout/settings': typeof AuthedLayoutSettingsRoute
  '/_authed/_layout/unassigned': typeof AuthedLayoutUnassignedRoute
  '/_authed/ticket': typeof AuthedTicketRouteWithChildren
  '/_authed/ticket/_layout': typeof AuthedTicketLayoutRouteWithChildren
  '/_authed/_layout/': typeof AuthedLayoutIndexRoute
  '/_authed/ticket/_layout/$ticketId': typeof AuthedTicketLayoutTicketIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/sign-in'
    | '/my-inbox'
    | '/reports'
    | '/settings'
    | '/unassigned'
    | '/ticket'
    | '/'
    | '/ticket/$ticketId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/sign-in'
    | '/my-inbox'
    | '/reports'
    | '/settings'
    | '/unassigned'
    | '/ticket'
    | '/'
    | '/ticket/$ticketId'
  id:
    | '__root__'
    | '/_authed'
    | '/sign-in'
    | '/_authed/_layout'
    | '/_authed/_layout/my-inbox'
    | '/_authed/_layout/reports'
    | '/_authed/_layout/settings'
    | '/_authed/_layout/unassigned'
    | '/_authed/ticket'
    | '/_authed/ticket/_layout'
    | '/_authed/_layout/'
    | '/_authed/ticket/_layout/$ticketId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthedRoute: typeof AuthedRouteWithChildren
  SignInRoute: typeof SignInRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthedRoute: AuthedRouteWithChildren,
  SignInRoute: SignInRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authed",
        "/sign-in"
      ]
    },
    "/_authed": {
      "filePath": "_authed.tsx",
      "children": [
        "/_authed/_layout",
        "/_authed/ticket"
      ]
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/_authed/_layout": {
      "filePath": "_authed/_layout.tsx",
      "parent": "/_authed",
      "children": [
        "/_authed/_layout/my-inbox",
        "/_authed/_layout/reports",
        "/_authed/_layout/settings",
        "/_authed/_layout/unassigned",
        "/_authed/_layout/"
      ]
    },
    "/_authed/_layout/my-inbox": {
      "filePath": "_authed/_layout.my-inbox.tsx",
      "parent": "/_authed/_layout"
    },
    "/_authed/_layout/reports": {
      "filePath": "_authed/_layout.reports.tsx",
      "parent": "/_authed/_layout"
    },
    "/_authed/_layout/settings": {
      "filePath": "_authed/_layout.settings.tsx",
      "parent": "/_authed/_layout"
    },
    "/_authed/_layout/unassigned": {
      "filePath": "_authed/_layout.unassigned.tsx",
      "parent": "/_authed/_layout"
    },
    "/_authed/ticket": {
      "filePath": "_authed/ticket",
      "parent": "/_authed",
      "children": [
        "/_authed/ticket/_layout"
      ]
    },
    "/_authed/ticket/_layout": {
      "filePath": "_authed/ticket/_layout.tsx",
      "parent": "/_authed/ticket",
      "children": [
        "/_authed/ticket/_layout/$ticketId"
      ]
    },
    "/_authed/_layout/": {
      "filePath": "_authed/_layout.index.tsx",
      "parent": "/_authed/_layout"
    },
    "/_authed/ticket/_layout/$ticketId": {
      "filePath": "_authed/ticket/_layout.$ticketId.tsx",
      "parent": "/_authed/ticket/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
