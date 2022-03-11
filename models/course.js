const {v4: uuid} = require('uuid');
const fs = require('fs');
const path = require('path');

class Course {
  constructor({title, price, img}) {
    this.id = uuid();
    this.title = title;
    this.price = price;
    this.img = img;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      img: this.img,
    };
  }

  async save() {
    const courses = await Course.getAll();
    courses.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
          path.join(__dirname, '..', 'data', 'courses.json'),
          JSON.stringify(courses),
          err => {
            if (err) reject(err);
            resolve();
          },
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
          path.join(__dirname, '..', 'data', 'courses.json'),
          'utf-8',
          (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
          },
      );
    });
  }

  static async getById(id) {
    const courses = await Course.getAll();
    return courses.find(elm => elm.id === id);
  }

  static async update(course) {
    const courses = await Course.getAll();
    const idx = courses.findIndex(elm => elm.id === course.id);
    courses[idx] = course;
    return new Promise((resolve, reject) => {
      fs.writeFile(
          path.join(__dirname, '..', 'data', 'courses.json'),
          JSON.stringify(courses),
          err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
      );
    });
  }
}

// fs.readFile(
//   path.join(__dirname, '..', 'data', 'courses.json'),
//   'utf-8',
//   (err, data) => {
//     if (err) reject(err);
//     if (Array.isArray(JSON.parse(data)) && JSON.parse(data).length !== 0) {
//       fs.writeFile(
//         path.join(__dirname, '..', 'data', 'courses.json'),
//         JSON.stringify(Array(0)),
//         (err) => {
//           if (err) reject(err);
//         }
//       )
//     }
//   }
// )

module.exports = Course;
