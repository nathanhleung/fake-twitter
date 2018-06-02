$(document).ready(() => {
   
   console.log("Frontend init");
   
   updateFeed();
   
   $("#postTweet").submit((e) => {
      
      e.preventDefault();
      
      console.log("Posting tweet...");
      
      $.ajax({
         url: "/",
         method: "POST",
         data: { name: $("#name").val(), username: $("#username").val(), text: $("#text").val() }
      }).done(() => {
         updateFeed();
      })
      
   });
    
});

function updateFeed() {
      
   console.log("Updating feed...");
   
   $.ajax({
    url: `../api/tweets`,
    dataType: "json",
   }).done((data) => {
      
      $("#tweets").empty();
      
      data.reverse();
      
      data.forEach(e => {
         $.ajax({
            url: `../api/user?id=${e.authorId}`,
            dataType: "json"
         }).done((userData) => {
            
            $("#tweets").append(`
            <li class="list-group-item">
            <b>${userData.name} (@${userData.username})</b>
            <p>${e.text}</p>
            </li>`);
            
         });
      });
   });
}

setInterval(updateFeed, 5000);