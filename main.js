const fs = require('fs')
const path = require('path')
const request = require('request')
const TurndownService = require('turndown')
const { downloadPath } = require('./config')
const headers = require('./headers')

const turndownService = new TurndownService()

const course =
  'https://gate.lagou.com/v1/neirong/kaiwu/getCourseLessons?courseId={{id}}'
const article =
  'https://gate.lagou.com/v1/neirong/kaiwu/getCourseLessonDetail?lessonId={{id}}'

/**
 * 创建课程
 * @param {*} id
 */
const createCourse = async (id) => {
  const filePath = path.join(__dirname, downloadPath)

  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath)
  }

  let courseName, messageList

  await new Promise((resolve) => {
    request(
      {
        url: course.replace('{{id}}', id),
        headers,
      },
      (error, response, body) => {
        const { content } = JSON.parse(body)

        courseName = content.courseName
        messageList = content.courseSectionList

        resolve()
      },
    )
  })

  const coursePath = path.join(downloadPath, courseName)

  if (fs.existsSync(coursePath) === false) {
    fs.mkdirSync(coursePath)
  }

  console.log(courseName)

  makeMarkDown(coursePath, messageList)
}

/**
 * 生成 markdown 文件
 * @param {*} coursePath 课程路径
 * @param {*} messageList 课程信息
 */
const makeMarkDown = (coursePath, messageList) => {
  messageList.forEach((message) => {
    const articlePath = path.join(coursePath, message.sectionName)

    if (fs.existsSync(articlePath) === false) {
      fs.mkdirSync(articlePath)
    }

    message.courseLessons.forEach((lesson) => {
      const theme = lesson.theme.replace(/[\\\/:*?"<>|]+/g, '-')
      const filePath = path.join(articlePath, `${theme}.md`)

      if (fs.existsSync(filePath) === false) {
        request(
          {
            url: article.replace('{{id}}', lesson.id),
            headers,
          },
          (error, response, body) => {
            const { content } = JSON.parse(body)
            const markdown = turndownService.turndown(content.textContent)
            fs.writeFile(filePath, markdown, { encoding: 'utf8' }, () => {})
          },
        )
      }
    })
  })
}

/**
 * 主函数
 */
const main = (courseIds) => {
  courseIds.forEach((id) => {
    createCourse(id)
  })
}

module.exports = main
