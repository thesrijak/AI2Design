/// <reference types="@figma/plugin-typings" />

import { showUI } from '@create-figma-plugin/utilities'

import { buildComponentSet } from './builder'
import { validateSchema } from './schema'

function postStatus(type: 'success' | 'error' | 'info', message: string) {
  figma.ui.postMessage({
    type: 'status',
    statusType: type,
    message
  })
}

export default function () {
  showUI({
    width: 540,
    height: 640,
    themeColors: true
  })

  figma.ui.onmessage = async function (message: any) {
    if (!message || message.type !== 'insert-design') {
      return
    }

    try {
      const raw = String(message.json || '').trim()
      if (!raw) {
        throw new Error('Paste some JSON before applying the design')
      }

      let data: any
      try {
        data = JSON.parse(raw)
      } catch (error: any) {
        throw new Error(`Invalid JSON: ${error.message}`)
      }

      const validation = validateSchema(data)
      if (validation.valid === false) {
        throw new Error(validation.errors.join(' | '))
      }

      const componentSet = await buildComponentSet(data)
      figma.currentPage.selection = [componentSet]
      figma.viewport.scrollAndZoomIntoView([componentSet])
      postStatus('success', `Component Set "${componentSet.name}" created successfully`)
    } catch (error: any) {
      postStatus(
        'error',
        error.message || 'Something went wrong while building the component set'
      )
    }
  }
}
