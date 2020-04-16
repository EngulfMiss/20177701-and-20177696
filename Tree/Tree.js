const btn = document.getElementById('generate')          //获取一个按钮对象
btn.onclick = () => {                                    //为按钮添加一个单击事件
    const textarea = document.getElementById('input')    //获取document对象
    const input = textarea.value.trim()                  //获取文本框中输入的内容
    const labs = input.split('\n\n')                     
    const data = []
    for (const lab of labs) {
        const lines = lab.trim().split('\n')             //将输入的文本按中间的换行切分
        const mentorRegex = /导师：(.+)/                  //通过正则表达式匹配导师这个根节点
        const mentor = lines[0].match(mentorRegex)[1]                          
        const labData = {
            id: mentor+'导师',
            children: []
        }
        const tmp = {}
        for (let line of lines) {
            line = line.trim()
            if (line.includes('导师')) {
                continue
            }
            const kv = line.split('：')
            const key = kv[0]
            //alert(key)   //“2016级博士生”
            const students = kv[1].split('、')   //“天一，王二，吴五”
            for (let i in students) {    //i = 0,1,2
                students[i] = {
                    id: students[i]
                }
            }
            const year = key.match(/[0-9]+/)[0]        //通过正则表达式匹配学年这个节点
            //alert(typeof(year))
            const type = key.split('级')[1]
            if (tmp[year] === undefined) {
                tmp[year] = {}
            }
            tmp[year][type] = students
        }




        for (const key of Object.keys(tmp)) {
            //alert(key)
            const yearStds = tmp[key]
            //console.log(yearStds)
            const types = ['本科生', '硕士生', '博士生']        //学位根节点
            const yearChildren = []
                types.forEach(type => {
                    if (yearStds[type] !== undefined) {
                        yearChildren.push({
                            id: key+'级'+type,
                            children: yearStds[type]
                        })
                    }
                })
            console.log(yearChildren)
            const yearData = {
                id: key+'学年',
                children: yearChildren
            }
            labData.children.push(yearData)
        }




        data.push(labData)
        //console.log(labData)
    }

    for (const item of data) {
        const ele = document.createElement('div')
        ele.id = item.id
        document.getElementById('nodes').appendChild(ele)
        generateGraph(ele.id, item)
    }
    document.getElementsByTagName('body').height = labs.length * 500 + 1000
}

const generateGraph = (container, data) => {
    var graph = new G6.TreeGraph({
        container: container,
        width: 1300,
        height: 600,
        pixelRatio: 2,
        linkCenter: true,
        modes: {
            default: [{
                    type: "collapse-expand",
                    onChange: function onChange(item, collapsed) {
                        var data = item.get("model").data;
                        data.collapsed = collapsed;
                        return true;
                    },
                },
                'drag-canvas',
                'zoom-canvas',
            ],
        },
        defaultNode: {
            size: 26,
            anchorPoints: [
                [0, 0.5],
                [1, 0.5]
            ],
            style: {
                fill: "#c4ff0e",
                // stroke: "#096dd9"
            }
        },
        defaultEdge: {
            shape: "cubic-vertical",
            style: {
                stroke: "#16eb52"   //线的颜色
            }
        },
        layout: {
            type: "compactBox",
            direction: "TB",
            
            getId: function getId(d) {
                return d.id;
            },
            getHeight: function getHeight() {
                return 16;
            },
            getWidth: function getWidth() {
                return 26;
            },
            getVGap: function getVGap() {
                return 80;
            },
            getHGap: function getHGap() {
                return 30;
            }
        }
    });

    graph.node(function (node) {
        let position = 'right';
      let rotate = 0;
      if (!node.children) {
        position = 'bottom';
        rotate = Math.PI / 2;
      }
        return {
            label: node.id,
            labelCfg: {
            position,
            offset: 5,
            style: {
            rotate,
            textAlign: 'start',
          },
        },
        };
    });

    graph.data(data);
    graph.render();
    graph.fitView();
}
