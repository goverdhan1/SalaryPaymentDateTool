const converter = require('json-2-csv');
const fs = require('fs');
class Payroll
{   
    year;
	fileName;
    constructor(fileName, year){
        this.year = year || '2022';
		this.fileName = fileName || 'payrollDates'
    }
	calculate() {
		let data = [];
		let month = 1;		
		let weekend = [0, 6]; // 0-Sat, 6-Sun. 
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
		while (month < 13) {
            let date = this.cal_days_in_month(this.year, month-1);
			date = this.year + '-' + month + '-' + date;
			let bonusDate = this.year + '-' + month + '-15';
			let day = new Date(date).getDay();
			let bonusDay = new Date(bonusDate).getDay();
			if(weekend.includes(day)){
				date = this.getWeekDate(date, day, 'Salary');				
			}
			if(weekend.includes(bonusDay) ){
				bonusDate = this.getWeekDate(bonusDate, bonusDay, 'Bonus');				
			}
			
			data.push({month:monthNames[month-1], salaryDate: date, bonusDate: bonusDate});
			month++;
		}
		this.downloadData(data);
	}

    cal_days_in_month(year, month) {
        var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

	getWeekDate(date, day, type) {
        date = new Date(date);
		if ( day == 0 && type == 'Salary' ) {
            date.setDate(date.getDate() - 1)
		} else if ( day == 6 && type == 'Salary' ) {
            date.setDate(date.getDate() - 2)
		} else if ( day == 0 && type == 'Bonus' ) {
            date.setDate(date.getDate() + 5)
		} else if ( day == 6 && type == 'Bonus' ) {
            date.setDate(date.getDate() + 4)
		}
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}

	downloadData(list){
        converter.json2csv(list, (err, csv) => {
            if (err) {
                throw err;
            }
    
            // print CSV string
            console.log(csv);
        
            // write CSV to a file
           fs.writeFileSync(`${this.fileName}.csv`, csv);
            
        });
	}
}

const myArgs = process.argv.slice(2);

obj = new Payroll(myArgs[0], myArgs[1]);
obj.calculate();

