import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

import { IInitDocumentation } from './documentation.interface'

export function initDocumentation(app: INestApplication, initData: IInitDocumentation) {
  const options = new DocumentBuilder()
    .setTitle(initData.title)
    .setDescription(initData.description)
    .setVersion(initData.version)
    .addBearerAuth()

  if (initData.tag && initData.tag.length) {
    initData.tag.forEach(singleTag => {
      options.addTag(singleTag)
    })
  }

  const swaggerOptions = options.build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup(initData.endpoint, app, document)
}