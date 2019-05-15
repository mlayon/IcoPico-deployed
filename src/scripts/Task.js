var CUR_NUM_TASKS = 3;

class Task extends Phaser.Scene {
    constructor(){
        super({key:"Task", active:false});
    }

    preload() {
        //asset preload
        this.cameras.main.setBackgroundColor('#aaa');
        this.load.image("menuPet", '../images/buttons/Other/menu.png');
        this.load.image("task_new", '../images/buttons/task_hub/task_new.png');
        this.load.image("task_done", '../images/buttons/task_hub/task_done.png');
        this.load.image("type1", '../images/buttons/task_hub/icecream.png');
        this.load.image("type2", '../images/buttons/task_hub/carrot.png');
        this.load.image("type3", '../images/buttons/task_hub/donut.png');
        this.load.image("type3", '../images/buttons/task_hub/money.png');
        this.load.image("x", '../images/buttons/Other/x.png');
        this.load.image("menuPet", '../images/buttons/Other/menu.png');
        this.load.image("get_new", '../images/buttons/task_hub/get_new.png');
        this.cameras.main.setBackgroundColor('#aaa');
    }

    create() {
        //  If a Game Object is clicked on, this event is fired.
        //  We can use it to emit the 'clicked' event on the game object itself.
        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);

        this.taskButtons = [];
        this.title = [];
        this.icon = [];
        this.description = [];

        //Create "tasks done" text to show up when there are no more tasks
        this.add.text(this.scale.width/2, 200, "All tasks complete. Great job!", {fontFamily: 'Helvetica', fontSize: 25})
          .setOrigin(0.5)
        ;

        //Create Menu Button
        let menu = this.add.sprite(this.scale.width*.04, this.scale.height*.05, 'menuPet');
        menu.setInteractive();
        menu.on('pointerdown', ()=> {
            this.scene.run('ShowMenu');
            this.scene.bringToTop('ShowMenu');
        });

        //Create dismiss task button
        var dismiss = this.add.sprite(this.scale.width/2, this.scale.height-80, "x")
          .setScale(1)
          .setInteractive({ useHandCursor: true})
          .setVisible(false)
          .on('clicked', dismiss, this);
        //send button to back for now until task is selected
        //this.scene.sendToBack('type2');

        //create task list containers
        for(let i = 0; i < CUR_NUM_TASKS; i++)
        {
            this.taskButtons[i] = this.add.container(this.scale.width/2, 150*i + 200);
        }

        //populate task list
        for(let i = 0; i < CUR_NUM_TASKS; i++)
        {
            this.taskButtons[i] = this.add.container(this.scale.width/2, 150*i + 200);
            //background sprite
            var sprite = this.add.sprite(0,0,'task_new')
            .setData('index', i)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('clicked', setSelected, this);

            //refresh button to get new task
            var new_task = this.add.sprite(175,-40,'get_new')
                .setData('rindex', i)
                .setScale(1.3)
                .setInteractive({ useHandCursor: true })
                //on('event', callback method, scene)
                .on('clicked', deleteTask, this);

            //task reward icon
            this.icon[i] = this.add.sprite(127,0,task_list.task[i].icon).setScale(0.3);

            //task title
            this.title[i] = this.add.text(-175,-45,task_list.task[i].title,
                {fontFamily: 'Helvetica', fontSize: 20, wordWrap: {width: 265, useAdvancedWrap:true}})
                .setColor('black');

            //task description
            this.description[i] = this.add.text(-175, -20,
              task_list.task[i].description,
                {fontFamily: 'Helvetica', fontSize: 14, wordWrap: {width: 265, useAdvancedWrap:true}})
                .setColor('black');

            //add all items to taskButton[i] container
            this.taskButtons[i].add([sprite, new_task, this.icon[i], this.title[i], this.description[i]]);
        }//end for

        /**
          * callback function for click
          **/
        function setSelected (tSprite) {
          var i = tSprite.getData('index');
          console.log(i);
          //switch active state
          if(!(this.taskButtons[i].getData('isActive'))) {
            this.taskButtons[i].setData('isActive', true);

            //flip background sprite to yellow or white
            this.taskButtons[i].addAt(
              this.add.sprite(0,0,'task_done')
              .setData('index', i)
              .setScale(0.3)
              .setInteractive({ useHandCursor: true })
              .on('clicked', setSelected, this)
              ,[, 0]);
            this.taskButtons[i].removeAt(1,[, true]);
            //show delete button
            dismiss.setVisible(true);
            //console.log(this.taskButtons[i].getData('isActive'));
          } else {
            this.taskButtons[i].setData('isActive', false);
            this.taskButtons[i].addAt(
              this.add.sprite(0,0,'task_new')
              .setData('index', i)
              .setScale(0.3)
              .setInteractive({ useHandCursor: true })
              .on('clicked', setSelected, this)
              ,[, 0]);
            this.taskButtons[i].removeAt(1,[, true]);

            //remove close button if nothing is selected
            var anyActive = false;
            for(var i = 0; i < this.taskButtons.length;i++)
            {
              if(this.taskButtons[i].getData('isActive'))
              {
                anyActive = true;
              }
            }

            if(!anyActive)
            {
              dismiss.setVisible(false);
            }
          }
        }

        /**
          * callback function for deleteTask button
          **/
        function deleteTask (rSprite) {
          var i = rSprite.getData('rindex');
          //delete task from task_list at index
          task_list.task.splice(i,1);

          //destroy whole task list
          for (var i = 0; i < CUR_NUM_TASKS; i++)
          {
            this.taskButtons[i].destroy(true);
          }

          //decrease total number of tasks
          CUR_NUM_TASKS--;

          //repopulate task list
          for(let i = 0; i < CUR_NUM_TASKS; i++)
          {
              this.taskButtons[i] = this.add.container(this.scale.width/2, 150*i + 200);

              //background sprite
              var sprite = this.add.sprite(0,0,'task_new')
              .setData('index', i)
              .setScale(0.3)
              .setInteractive({ useHandCursor: true })
              .on('clicked', setSelected, this);

              //refresh button to get new task
              var new_task = this.add.sprite(175,-40,'get_new')
                  .setData('rindex', i)
                  .setScale(1.3)
                  .setInteractive({ useHandCursor: true })
                  //on('event', callback method, scene)
                  .on('clicked', deleteTask, this);

              //task reward icon
              //task reward icon
              this.icon[i] = this.add.sprite(127,0,task_list.task[i].icon).setScale(0.3);

              //task title
              this.title[i] = this.add.text(-175,-45,task_list.task[i].title,
                  {fontFamily: 'Helvetica', fontSize: 20, wordWrap: {width: 265, useAdvancedWrap:true}})
                  .setColor('black');

              //task description
              this.description[i] = this.add.text(-175, -20,
                task_list.task[i].description,
                  {fontFamily: 'Helvetica', fontSize: 14, wordWrap: {width: 265, useAdvancedWrap:true}})
                  .setColor('black');

              this.taskButtons[i] = this.add.container(this.scale.width/2, 150*i + 200);
              this.taskButtons[i].add([sprite, new_task, this.icon[i], this.title[i], this.description[i]]);
          }//end for
      }//end deleteTask

      function dismiss()
      {
        for(var i = 0; i < this.taskButtons.length;i++)
        {
          if(this.taskButtons[i].getData('isActive'))
          {
            task_list.task.splice(i,1);
            CUR_NUM_TASKS--;
          }
        }

        //destroy whole task list
        for (var i = 0; i < this.taskButtons.length; i++)
        {
          this.taskButtons[i].destroy(true);
        }

        //repopulate task list
        for(let i = 0; i < CUR_NUM_TASKS; i++)
        {
            this.taskButtons[i] = this.add.container(this.scale.width/2, 150*i + 200);

            //background sprite
            var sprite = this.add.sprite(0,0,'task_new')
            .setData('index', i)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('clicked', setSelected, this);

            //refresh button to get new task
            var new_task = this.add.sprite(175,-40,'get_new')
                .setData('rindex', i)
                .setScale(1.3)
                .setInteractive({ useHandCursor: true })
                //on('event', callback method, scene)
                .on('clicked', deleteTask, this);

            //task reward icon
            //task reward icon
            this.icon[i] = this.add.sprite(127,0,task_list.task[i].icon).setScale(0.3);

            //task title
            this.title[i] = this.add.text(-175,-45,task_list.task[i].title,
                {fontFamily: 'Helvetica', fontSize: 20, wordWrap: {width: 265, useAdvancedWrap:true}})
                .setColor('black');

            //task description
            this.description[i] = this.add.text(-175, -20,
              task_list.task[i].description,
                {fontFamily: 'Helvetica', fontSize: 14, wordWrap: {width: 265, useAdvancedWrap:true}})
                .setColor('black');

            this.taskButtons[i] = this.add.container(this.scale.width/2, 150*i + 200);
            this.taskButtons[i].add([sprite, new_task, this.icon[i], this.title[i], this.description[i]]);
        }//end for

      }
    }//end create
}//end Tasks