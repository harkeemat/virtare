import {
  dateOnlyFormatSImple,
  yaxis,
  dataLabels,
  plotOptions,
  dateOnlyFormat,
  timeStamp,
  startimeAdd,
  endTimeAdd
} from '@/commonMethods/commonMethod';
import moment from 'moment';

export const taskRoute = async (state, data) => {
  state.taskRoute = data;
};
export const task = async (state, tasks) => {
  state.tasksList = tasks.data.map((element) => {
    element.dueDate = element.dueDate?dateOnlyFormat(element.dueDate):null;
    element.startDate = element.startDate?dateOnlyFormat(element.startDate):null;
    element.category = element.category.map((item) => item.taskCategory);
    return element;
  });

  state.taskMeta = tasks?.meta?.pagination;

};

export const taskStatusSuccess = async (state, status) => {
  let data = [];
  status.forEach((element) => {
    if (element.text != 'Total Tasks') {
      data.push(element);
    }
  });
  state.taskStatus = status;
  state.incompleteAllTask = data.map((item) => item.total);
  state.completedAllTask = {
    chart: {
      type: 'pie',
    },
    indexLabel: data.map((item) => item.text),
    labels: data.map((item) => item.text),
    colors: data.map((item) => item.color),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }
}
export const completeTaskRate = async (state, count) => {
  state.completeTaskRate = count.taskCompletionRates;
}

export const allTaskStatusSuccess = async (state, status) => {
  state.allTaskStatus = status;
  let task = [];
  const completed = status.filter((object) => Object.values(object).includes('Completed'));
  let today = moment();
  today.subtract(7, 'days');
  for (let i = 0; i < 7; i++) {
    var day = today.add(1, 'days');
    const results = completed.filter((object) => Object.values(object).includes(day.format('dddd')));

    let obj = '';
    if (results.length > 0) {
      results.forEach((items) => {
        task.push({
          count: items.total,
          time: day.format('ddd'),
          from: timeStamp(startimeAdd(day)),
          today: timeStamp(endTimeAdd(today))
        });
      });
    } else {
      obj = {
        count: 0,
        time: day.format('ddd'),
        from: timeStamp(startimeAdd(day)),
        today: timeStamp(endTimeAdd(today))
      };
      task.push(obj);
    }
  }
  state.taskComplete = task
  state.completionSeries = [{
    name: 'Completed',
    data: task.map((item) => {
      return item.count;
    })
  }];
  state.completionOptions = {
    chart: {},
    dataLabels: {
      enabled: false
    },
    colors: ['#0fb5c2'],
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: task.map((item) => {
        return item.time;
      })
    },
    yaxis: yaxis('Task Count'),
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      }
    }
  };
};

export const taskPriority = async (state, priorities) => {
  state.taskPriority = {
    optionPriority: {
      annotations: {
        points: [{
          x: 'In',
          seriesIndex: 0,
          label: {
            borderColor: '#775DD0',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#775DD0'
            }
          }
        }]
      },
      chart: {
        type: 'bar'
      },
      plotOptions: plotOptions(10, '20%', '100%', true, false, 'bottom'),
      dataLabels: dataLabels(false),
      colors: priorities.map((item) => {
        return item.color;
      }),
      stroke: {
        width: 1,
        colors: ['#fff']
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: priorities.map((item) => {
          return item.text;
        })
      },
      yaxis: yaxis('Task Count')
    },
    seriesPriority: [{
      name: 'Task Count',
      data: priorities.map((item) => {
        return item.total;
      })
    }]
  };
};

export const taskTeamMember = async (state, TeamMember) => {
  let teamTopMember = [];
  TeamMember.map((item, index) => {
    if (index <= 4) {
      teamTopMember.push(item);
    }
  });
  state.taskTeamMember = {
    optionTeamMember: {
      annotations: {
        points: [{
          x: 'In',
          seriesIndex: 0,
          label: {
            borderColor: '#775DD0',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#775DD0'
            }
          }
        }]
      },
      chart: {
        type: 'bar'
      },
      plotOptions: plotOptions(10, '20%', '100%', true, false, 'bottom'),
      dataLabels: dataLabels(false),
      stroke: {
        width: 1,
        colors: ['#fff']
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: teamTopMember.map((item) => {
          return item.text;
        })
      },
      yaxis: yaxis('Task Count')
    },
    seriesTeamMember: [{
      name: 'Task Count',
      data: teamTopMember.map((item) => {
        return item.total;
      })
    }]
  };
};

export const taskCategory = async (state, TeamMember) => {
  state.taskCategory.business = TeamMember.map((item) => item.total);
  state.taskCategory.premium = {
    chart: {
      width: 412,
      type: 'pie'
    },
    labels: TeamMember.map((item) => item.text),
    colors: ['#0fb5c2', '#40a9ff', '#267dff', '#8e60ff'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
};
export const addTask = async (state, result) => {
  state.addTask = result;
};
export const editTask = async (state, result) => {
  let editTaskStateArray = []
  state.editTask = result;
  state.editTask.taskStatusName = result.taskStatus;
  state.editTask.priorityName = result.priority;
  state.editTask.assignedTo.forEach((item) => {
    state.editTask.entityType = item.entityType;
  });
  state.editTask.assignedTo.map((item) => {
    editTaskStateArray.push({
      value: item.id,
      label: item.name
    })
  })
  state.editTaskState = editTaskStateArray

  state.editTask.assignedName = state.editTask.assignedTo.map((item) => item.name);
  state.editTask.assignedTo = state.editTask.assignedTo.map((item) => item.id);
  state.editTask.dateDue = dateOnlyFormat(result.dueDate);
  state.editTask.dateStart = dateOnlyFormat(result.startDate);
  state.editTask.taskCategory = state.editTask.category.map((item) => item.id);
  state.editTask.dueDate = dateOnlyFormatSImple(state.editTask.dueDate);
  state.editTask.startDate = dateOnlyFormatSImple(state.editTask.startDate);
  (state.editTask.priority = result.priorityId), (state.editTask.taskStatus = state.editTask.taskStatusId);
  state.editTask.categories = result.category.map((item) => item.taskCategory);
  state.editTask;
};

export const updateTask = async (state, result) => {
  state.updateTask = result;
};

export const latestTaskSuccess = async (state, result) => {
  if (result && result.length > 0) {
    result.date = dateOnlyFormat(result.date);
    state.latestTask = result;
  } else {
    state.latestTask = null;
  }
};

export const showTaskModalData = (state, data) => {
  state.showTaskModalData = data.map((element) => {
    element.dueDate = dateOnlyFormat(element.dueDate);
    element.startDate = dateOnlyFormat(element.startDate);
    element.category = element.category.map((item) => item.taskCategory);
    return element;
  });

}
export const taskDateFiletrs = (state, data) => {
  state.taskDateFiletrs = data;
}
