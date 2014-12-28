$(function () {
	$('#booth-form').on('submit', function(event){
		event.preventDefault();
		var boothParams={};

		$(this).find('input').each(function() {
		    boothParams[$(this).attr('name')] = $(this).val(); 
		});   
		var booth = JSON.stringify(boothParams);

		var posting = $.post('/booth/add', booth);
		posting.done(function(data){
			alert(data);
			$("#booth-form").each(function(){
			    this.reset();
			});
		});
	});
})