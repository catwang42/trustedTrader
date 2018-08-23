$(function() {
    
    
    
    var maxquestions = 3; //12; change it to 3 
    var qnflag = [false,false,false,false,false,false,false,false,false,false,false,false,false];   //using it as index 1. First element will always be false and not used.
    var lastqnid = 1,nextqnid;
    var headerheight; 

    var td = {};    //tiles dictionary
    td.aq1 = "tile1";
    td.aq2 = "tile2";
    td.aq3 = "tile3";
    // td.aq4 = "tile4";
    td.aq5 = "tilelawyer";


      
	$("button").mousedown(function(e) { //replaced click to prevent focus on button after clicking.
		if($(this).hasClass('btn')){
            e.preventDefault();
            buttonText = $(this).text();
            currentq = $(this).closest('div.qnwrapper').first();
            currentqid = parseInt(currentq.attr('id').substring(2));
     
            lastqnid = currentqid;
            showTilesOnSelect(currentqid,buttonText);
            if($(this).hasClass('next')){                                           // is single choice option.
                //ToDo: unselect any other option previously selected.
                if(!buttonText.includes("Next")){                                //Next button is not an option.
                    
                    $(this).parent().children('button').each(function(index,element){
                        $(element).addClass('btn-outline-primary').removeClass('btn-primary');
                    });
                    $(this).toggleClass('btn-outline-primary').toggleClass('btn-primary'); //select single select option.
                }
                currentq.removeClass("active");
                disableBelow(currentqid);
                nextqnid = activateNext(currentqid);
                qheight = currentq.outerHeight(); 
                showTilesOnSelect(nextqnid,"");
                $("#scroll-report").animate({
                    scrollTop: '+='+qheight+'px'
                    
                },{queue:false,duration: 1000}); 
            } else{                                                               // is multi choice option
                $(this).parent().children('button').each(function(index,element){
                    if($(element).hasClass('next')){    //de select any previously single select option.
                        $(element).addClass('btn-outline-primary').removeClass('btn-primary');
                    }
                });
                $(this).toggleClass('btn-outline-primary').toggleClass('btn-primary');  // select multi select option.
            }
        }
	});
    
    var showTilesOnSelect = function(qnid,option){
        //The function changes tiles on input change 
        if(!qnflag[qnid]){  //landing to this qn id for the first time.
            qnflag[qnid] = true;
            //question specific tile here.
            qntile="#tile"+qnid;
            enableTile(qntile);
        }
        if(option){
            tileoption = "#tile"+qnid+"-"+option.replace(/[\s\'\,.\(\)\/]/g, '').toLowerCase(); //avoid adding value to all buttons.
            enableTile(tileoption);
        }
    };
    
    var enableTile = function(tileselector){
        if($(tileselector).length > 0){
            
            $(tileselector).show();
            $('#tilesbar').animate({
                scrollTop: '+=420'  //420 is fixed height of tilesbar.
            },{queue:false,duration: 1000});
            
        }
        //ToDo optional
//        remove all other tiles.
    };
    
    var disableBelow = function(curid) {
        belowqid = curid+1;
        for(belowqid; belowqid<=maxquestions+1; belowqid++){
            belowqn = getqnbyid(belowqid);
            $(belowqn).addClass('next').removeClass('active');
        }
    }; 
    
    var activateNext = function(curid){
        nextqn = getqnbyid(curid+1);
        $(nextqn).removeClass('next').addClass('active');
        if(curid==maxquestions){
            //$('.results.container').show();
           
        } else {
            //$('.results.container').hide();
            
        }
        return curid+1;
    };
    
    var getqnbyid = function(id){
        return "#qn"+id;
    };


    var observeQuestions = function(){
        questionobserver = new IntersectionObserver(entries =>{
            entries.forEach(entry=>{
                if(entry.intersectionRatio>0.9) {
                    //ToDo: Handle questions scrolling by highlighting appropriate tile.
//                    console.log(entry.target.id);
//                    console.log(td[entry.target.id]);
                }
            });
        },{threshold:[1.0]});
        questions = document.querySelectorAll('.aquestion');
        questions.forEach(question=>{
            questionobserver.observe(question);
        });
    }
    
    $('#videoModal').on('shown.bs.modal', function(event) {
        document.getElementById("teamvideo").play();
    });
    
    $('#videoModal').on('hidden.bs.modal', function(event) {
        document.getElementById("teamvideo").pause();
    });
    
    $('#appointmentModal').on('shown.bs.modal', function(event) { 
        console.log("showing appointments");
        lawyerbooked = event.relatedTarget.id;
        console.log(lawyerbooked);
        timebooked=$('#'+lawyerbooked).parent().find('input[type=radio]:checked').next().text();
        console.log(timebooked);
        $('#lawyer-time').text($('#'+lawyerbooked).parent().find('input[type=radio]:checked').next().text());
        $('#lawyer-name').text(lawyerbooked.replace("-"," "));
        if(timebooked.includes("different")){
            $("#choosetime").show();
        } else {
            $("#choosetime").hide();
            $("#verifytime").hide();
            $("#lawyer-time").show();
        }
        $(".tilesbar").css("max-height","420px");
        $("#tileappt").show();
        $("#tilesbar").animate({
            scrollTop: ($("#tileappt").offset().top-250)
        },{queue:false,duration: 1000});
    }) ;
    
    $("#verifybooking").click(function(e){
        console.log("verifying booking");
        time = $("#meetingdifftime").val().replace("T"," ");
        $("#difftime").text(time);
        $("#choosetime").hide();
        $("#lawyer-time").hide();
        $("#verifytime").show();
    });
    
    $( document).ready(function() {
        console.log( "ready!" );
        $('.main').show();
        showTilesOnSelect(1,'');
        resetsidebar();
        observerLawyers();
        observeQuestions();
        
    });
    
    $('input[type=radio]').click(function(event){
       $(this).closest('form').find('.btn').prop('disabled',false);
    });
    
    $( window ).resize(function() {
        resetsidebar();
    });
    
    

});