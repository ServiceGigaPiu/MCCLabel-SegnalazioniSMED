/* ################################################################################################################################
   ################################ GENERAL PURPOSE / UTILS  ###################################################################### */

   const monthNames = [ "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novermbre", "Dicembre"]; //currently mostly used in charts
   //var charts
   //3 x var "gauges"

   /**
    * sequentially push values of arr
    * @param {any[]} arr 
    */
   Array.prototype.seqPush = function (arr){
      for(let val of arr)
         this.push(val);
   }
   
   /**
    * @summary sequentially push provided values into arr1.
    * @param {any[]} arr1 array to push values into
    * @param {any | any[]} valOrArr values to push
    */
   function arrayAppend(arr1,valOrArr){
      if(typeof(valOrArr) == "array")
         for(let val of valOrArr)
            arr1.push(val);
      else
         arr1.push(val);
   } 

   //
   /**
    * @summary recursively merge two Objects
    * @desc overlay sec onto main. keeps properties of both. undefined properties of main are directly assigned from sec.
    * - ex: main : {a, b:b1} sec:{b:b2, c} -> res:{a , b:b2, c} where:
    * - -res.a===main.a
    * - -res.c===sec.c
    * - -res.b!==sec.b2
    * @param {Object} main 
    * @param {Object} sec 
    */
   function mergeRec(main,sec,){
      for(let p in sec){
         //if(main[p]===undefined) //commented bcs implicitly included in the next if condition //(typeof(undefVar) <=> "undefined")
            //if(deepCopy && typeof(main[p]) =="object") //too big an hustle
               //main[p] = sec[p];
         if(sec[p].constructor == Object && typeof(main[p]) == "object")
            mergeRec(main[p],sec[p]);
         else
            main[p] = sec[p];         
      }
   }

   function safeStringify(obj){
      var cache = [];
      var cacheKeys = [];
      return JSON.stringify(obj, (key, value) => {
         if (typeof value === 'object' && value !== null) {
            //Duplicate reference found -> discard key / store
            const idx = cache.indexOf(value)
            //if duplicate found
               //return twin's key instead
            if(idx != -1) //-1 means not present
               return "dupOf_"+(cacheKeys[idx].toString() ?? "root");
               //else store it
            else{
               cache.push(value);
               cacheKeys.push(key);
            }
         }
         return value;
      });
   }
   
   /**
    * takes a number and appends '0' until it has AT LEAST [digits] digits
    * @param {number} num value to format
    * @param {number} digits 
    * @returns {string} num with appended '0'
    */
   function fixedDigits(num,digits){
      for(let i=digits;i<digits;i--)
         if(num < 10*i)
            ret += "0";
      return ret + num;
   }
   
   /**
    * shorthand for math.random between  two numbers, either positive or negative.
    * @param {number} min 
    * @param {number} max 
    * @param {number} sumRandTimes >= 0, natural, 
    * @returns 
    */
   function randBetween(min,max,sumRandTimes=1){
      let r = 0;
      if(max < min)
         [min,max] = [min, max];
      for(let i=0; i<sumRandTimes; i++)
         r += Math.random();
      return min + (r/sumRandTimes) * (max-min);
   }
   
   /* ################################################################################################################################
      ################################### UIBUILDER ################################################################################## */
   /**
    * enforce msg standards
    * send a message to nodered through uibuilder
    * @param {"event"|"request"} type 
    * @param {String} topic 
    * @param {null|Object} payload 
    */
   var socketMsgQueue = [];
   function sendToServer(type, topic, payload=null, waitForSocket=true){
      let msg = {type:type,topic:topic,payload:payload};
      if(waitForSocket){
         if(uibuilder.ioConnected)
            uibuilder.send(msg);
         else
            socketMsgQueue.push(msg);
      }
      else
      uibuilder.send(msg);
   }
   uibuilder.onChange('ioConnected', function(connected){
      console.info('[indexjs:uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', connected)
      app.socketConnectedState = connected
   });
   uibuilder.onChange("ioConnected",(ioConnected)=>{
      if(ioConnected){
         while(socketMsgQueue.length)
            uibuilder.send(socketMsgQueue.shift());
      }
   });

   /* ################################################################################################################################
      ################################### ?????????  ################################################################################# */