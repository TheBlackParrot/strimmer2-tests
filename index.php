<html>

<head>
	<style>
		body {
			font-family: "Roboto";
			line-height: 24px;
			margin: 0;
		}
		.good, .good td {
			color: #4CAF50;
		}
		.bad, .bad td {
			color: #F44336;
		}
		.service, .service td {
			color: #2196F3;
		}
		.main_table {
			padding: 0;
			margin: 0;
			border-spacing: 0;
			width: 100%;
		}
		.main_table tr td {
			padding: 6px;
			border-bottom: 1px solid rgba(0,0,0,0.05);
		}

		.replacement_section {
			position: fixed;
			bottom: 0;
			left: 0;
			width: calc(100% - 16px);
			padding: 8px;
			background-color: #333;
			color: #fff;
			box-shadow: 0px -2px 4px rgba(0,0,0,0.33);
			display: none;
		}
		.replacement_input {
			width: 100%;
			outline: none;
			border: 1px solid #777;
			background-color: #000;
			color: #fff;
			font-family: "Roboto";
			padding: 4px;
		}
		.progress {
			padding-left: 24px;
			color: #666;
			font-size: 9pt;
			font-style: italic;
		}
		.success {
			color: #0f0;
		}
		.fail {
			color: #f00;
		}
	</style>
</head>

<body>
	<table class="main_table">
	</table>

	<div class="replacement_section">
		Replacing <span class="rp_sid">[STRIMMER_ID]</span>...
		<span class="progress" id="removing">Removing old entry</span>
		<span class="progress" id="adding">Adding new entry</span>
		<br/>
		<input type="textarea" class="replacement_input"/>
		<br/>
		<span style="font-size: 8pt; color: rgba(255,255,255,0.66);">Status: <span class="status_response">N/A</span></span>
	</div>

	<script src="js/jquery.js"></script>
	<script src="js/library-errorlist.js"></script>

	<script>
		var replacing = "";
		var inProgress = 0;

		$(".main_table").on("click", "tr", function(){
			if(inProgress) {
				return;
			}

			$(".rp_sid").text($(this).attr("s_id"));
			replacing = $(this).attr("s_id");

			$("#removing").removeClass("success");
			$("#removing").removeClass("fail");
			$("#adding").removeClass("success");
			$("#adding").removeClass("fail");

			$(".replacement_section").show();
		});

		$(".main_table").css("padding-bottom", $(".replacement_section").height() + "px");

		$(".replacement_input").keypress(function(event){
			if(event.which == 13) {
				var new_url = $(this).val();

				if(new_url == "") {
					return false;
				}

				if(inProgress) {
					return false;
				}

				inProgress = 1;

				removeStrimmerEntry(replacing, function(data){
					if(data == "1") {
						$("#removing").addClass("success");
						$(".status_response").text("Successfully removed " + replacing);

						setTimeout(function(){
							addStrimmerReplacement(new_url, function(data, error){
								inProgress = 0;

								if(error) {
									$(".status_response").text(data);
									$("#adding").addClass("fail");
									return;
								}

								$("#adding").addClass("success");
								$(".status_response").text("Successfully replaced " + replacing);

								$("tr[s_id='" + replacing + "']").css("color", "#FFC107");
								$("tr[s_id='" + replacing + "']").css("background-color", "#FFF8E1");
							})
						}, 200);
					} else {
						$("#removing").addClass("fail");
						$(".status_response").text(data);
					}
				});
			}

			event.preventDefault();
			return false;
		});
	</script>
</body>

</html>