const inquirer = require('inquirer')
const request = require('request')
const headers = require('./headers')
const main = require('./main')

const courseHasBuy =
  'https://gate.lagou.com/v1/neirong/kaiwu/getAllCoursePurchasedRecordForPC?t={{t}}'

;(async () => {
  const choices = await new Promise((resolve) => {
    request(
      {
        url: courseHasBuy.replace('{{t}}', Date.now()),
        headers,
      },
      (error, response, body) => {
        const content = JSON.parse(body)
        const courses = content.content.allCoursePurchasedRecord[0].courseRecordList.map(
          (item) => ({
            name: item.name,
            value: item.id,
          }),
        )

        resolve(courses)
      },
    )
  })

  inquirer
    .prompt({
      type: 'checkbox',
      name: 'ids',
      message: 'Select the courses that need to be converted to markdown:\n',
      pageSize: Infinity,
      choices,
      validate(answer) {
        if (answer.length < 1) {
          console.log('\nIf nothing is selected, the program ends.')
          process.exit()
        }

        return true
      },
    })
    .then((answers) => {
      main(answers.ids)
    })
    .catch((error) => {
      console.log(error)
    })
})()
