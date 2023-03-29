Feature: Booking a movie-1 ticket for tomorrow

    Scenario: The user must select a seat and order a ticket
        Given user is on "/index.php" page
        When user select 2-th day and movie
        And select and book 10 row and 1 seat
        Then user received information about ticket

    Scenario: user wants to order three tickets for Movie-1
        Given user is on "/index.php" page
        When user select 2-th day and movie about Train
        And remember cost vip tickets
        And select and book 2 row and 2 seat
        Then user check price about ticket

    Scenario: The user wants to check if the seat is booked
        Given user is on "/index.php" page
        When user select 2-th day and test movie
        And select, book and buy 2 row and 1 seat
        And user is on "/index.php" page
        When user select 2-th day and test movie
        Then sees that 2 row and 1 seat is taken trying select them, but button is disabled
        
