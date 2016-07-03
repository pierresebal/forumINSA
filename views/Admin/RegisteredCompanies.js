<h1>Partie admin</h1>

<% if (req.session.isAdmin != true) { %>

<form method="POST" action="/Admin/Login">
  <input type="password" name="password"/>
  <input type="submit" value="Se connecter"/>
</form>

<% } else { %>

<h2>Entreprises enregistrées sur le site</h2>

<table>
  <tr>
    <td>Nom</td> <td>PME</td> <td>Siret</td>  <td>blacklist</td>
  </tr>
  <% companies.forEach( function(company) {%>
  <tr>
    <td>
      <%=company.companyName %>
    </td>
    <td>
      <%=company.isPME %>
    </td>
    <td>
      <%=company.siret %>
    </td>
    <td>
      <%=company.blacklist %>
    </td>
  </tr>
  <% }); %>
</table>



<% } %>
