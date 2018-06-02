$(document).ready(() => {
   
   console.log("Frontend init");
   
   updateFeed();
   
   $("#postTweet").submit((e) => {
      e.preventDefault();
      
      console.log("Posting tweet...");
      
      $.post(url, { data }, (success) => {
         
      })
      
   });
    
});

function updateFeed() {
      
   console.log("Updating feed...");
   
   $.ajax({
    url: "../api/tweets",
    dataType: "json",
   }).done((data) => {
      
      $("#tweets").empty();
      
      data.forEach(e => {
         $.ajax({
            url: `../api/user?id=${e.authorId}`,
            dataType: "json"
         }).done((userData) => {
            
            $("#tweets").append(`
            <div class="container-fluid">
            <p>${userData.name} (@${userData.username})</p>
            <p>${e.text}</p>
            </div>`);
            
         });
      });
   });
}

setInterval(updateFeed, 5000);